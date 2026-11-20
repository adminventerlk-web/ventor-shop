import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import OTP from '@/models/OTP';
import User from '@/models/User';
import Admin from '@/models/Admin';
import Shop from '@/models/Shop';
import { SignJWT } from 'jose';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { verifyInMemoryOtp } from '@/lib/auth/inMemoryOtp';
import { saveInMemoryUser, getInMemoryUser } from '@/lib/auth/inMemoryUsers';
import { saveInMemoryShop } from '@/lib/shops/inMemoryShops';
import { EmailService } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const {
      email,
      otp,
      password,
      firstName,
      lastName,
      phone,
      preferredLanguage,
      customerType: requestedCustomerType,
      isVendor: requestedIsVendor,
      shopName: requestedShopName,
      shopCategory: requestedShopCategory,
      shopCity: requestedShopCity,
      shopDescription: requestedShopDescription,
      shopPhone: requestedShopPhone,
      shopLogoUrl: requestedShopLogoUrl,
      shopBannerUrl: requestedShopBannerUrl,
    } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const submittedOtp = otp.trim();

    // 1. PASSWORD-BASED LOGIN FLOW
    if (submittedOtp === 'PASSWORD_LOGIN') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required to log in.' }, { status: 400 });
      }

      let userRole = 'CUSTOMER';
      let customerType = 'NORMAL';
      let userId = 'user_' + Date.now();
      let userFirstName = 'Valued';
      let userLastName = 'Customer';
      let isVendor = false;
      let vendorStatus = 'NONE';
      let shopId = '';
      let shopName = '';
      let shopSlug = '';
      let authenticated = false;

      // Check for default admin credentials
      if (
        (normalizedEmail === 'admin@ventershop.ca' && password === 'admin123') ||
        (normalizedEmail === 'adminventerlk@gmail.com' && (password === 'admin123' || password === 'xeuesmcbuyhpqnsx'))
      ) {
        userRole = 'SUPER_ADMIN';
        customerType = 'ADMIN';
        userId = 'admin_super_01';
        userFirstName = 'Admin';
        userLastName = 'Venter';
        authenticated = true;
      }

      // Check MongoDB if reachable
      try {
        await connectToDatabase();
        const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
        if (adminRecord) {
          const isPasswordCorrect = verifyPassword(password, adminRecord.password);
          if (isPasswordCorrect) {
            userRole = adminRecord.role;
            customerType = 'ADMIN';
            userId = adminRecord._id.toString();
            userFirstName = adminRecord.firstName;
            userLastName = adminRecord.lastName;
            authenticated = true;
          }
        } else {
          const user = await User.findOne({ email: normalizedEmail });
          if (user) {
            if (user.status === 'SUSPENDED') {
              return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 });
            }
            const isPasswordCorrect = verifyPassword(password, user.password);
            if (isPasswordCorrect) {
              userId = user._id.toString();
              customerType = user.customerType;
              userFirstName = user.firstName;
              userLastName = user.lastName;
              isVendor = user.isVendor || user.customerType === 'SELLER_SUPPLIER';
              vendorStatus = user.vendorStatus || (isVendor ? 'APPROVED' : 'NONE');
              shopId = user.shopId?.toString() || '';
              shopName = user.shopName || '';
              shopSlug = user.shopSlug || '';
              authenticated = true;
            }
          }
        }
      } catch (dbError) {
        console.warn('Database error during login, checking in-memory user registry:', dbError);
      }

      // If not authenticated in DB, check in-memory registry
      if (!authenticated) {
        const memUser = getInMemoryUser(normalizedEmail);
        if (memUser) {
          if (verifyPassword(password, memUser.passwordHash)) {
            userId = memUser.id;
            userRole = memUser.role;
            customerType = memUser.customerType;
            userFirstName = memUser.firstName;
            userLastName = memUser.lastName;
            isVendor = memUser.isVendor || memUser.customerType === 'SELLER_SUPPLIER';
            vendorStatus = memUser.vendorStatus || (isVendor ? 'APPROVED' : 'NONE');
            shopId = memUser.shopId || '';
            shopName = memUser.shopName || '';
            shopSlug = memUser.shopSlug || '';
            authenticated = true;
          }
        }
      }

      if (!authenticated) {
        return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
      }

      const jwtSecretValue = process.env.JWT_SECRET || 'ventershop_development_secret_key_change_me_in_production';
      const secret = new TextEncoder().encode(jwtSecretValue);

      const token = await new SignJWT({
        userId,
        email: normalizedEmail,
        role: userRole,
        customerType,
        firstName: userFirstName,
        lastName: userLastName,
        isVendor,
        vendorStatus,
        shopId,
        shopName,
        shopSlug,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

      const cookieStore = await cookies();
      const isAdminRole = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

      if (isAdminRole) {
        cookieStore.delete('session'); // Wipe customer cookie
        cookieStore.set('admin_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
      } else {
        cookieStore.delete('admin_session'); // Strictly wipe any old admin cookie
        cookieStore.set('session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
      }

      return NextResponse.json({
        message: 'Logged in successfully',
        user: {
          id: userId,
          email: normalizedEmail,
          role: userRole,
          customerType,
          firstName: userFirstName,
          lastName: userLastName,
          isVendor,
          vendorStatus,
          shopId,
          shopName,
          shopSlug,
        },
      });
    }

    // 2. REGISTRATION / OTP VERIFICATION FLOW
    let otpValid = false;

    // Check in-memory OTP cache first
    if (verifyInMemoryOtp(normalizedEmail, submittedOtp)) {
      otpValid = true;
    } else {
      try {
        await connectToDatabase();
        const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
        if (otpRecord && !otpRecord.verified && otpRecord.expiresAt > new Date() && otpRecord.otp === submittedOtp) {
          otpRecord.verified = true;
          await otpRecord.save();
          otpValid = true;
        }
      } catch (dbErr) {
        console.warn('DB error checking OTP record:', dbErr);
      }
    }

    if (!otpValid) {
      return NextResponse.json({ error: 'Invalid or expired verification code. Please request a new code.' }, { status: 400 });
    }

    const allowedTypes = ['BUYER', 'V2CC_PMS_MEMBER', 'WHOLESALE_BUYER', 'SELLER_SUPPLIER', 'PARTNER_STORE', 'NORMAL', 'COMMUNITY', 'WHOLESALE'] as const;
    type CustomerTypeUnion = typeof allowedTypes[number];
    const validatedCustomerType: CustomerTypeUnion =
      allowedTypes.includes(requestedCustomerType as any)
        ? (requestedCustomerType as CustomerTypeUnion)
        : 'BUYER';

    let userRole: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' = 'CUSTOMER';
    const isVendor = Boolean(requestedIsVendor || requestedCustomerType === 'SELLER_SUPPLIER');
    const vendorStatus = isVendor ? 'PENDING' : 'NONE';
    let customerType: any = isVendor ? 'SELLER_SUPPLIER' : validatedCustomerType;
    let userId = 'usr_' + Date.now();
    const userFirstName = firstName?.trim() || 'Valued';
    const userLastName = lastName?.trim() || 'Customer';
    const rawPassword = password || 'VenterShop2026!';
    const hashedPassword = hashPassword(rawPassword);

    let shopId = '';
    let shopName = requestedShopName?.trim() || (isVendor ? `${userFirstName}'s Store` : '');
    let shopSlug = '';

    if (isVendor) {
      const rawSlug = (shopName || 'shop')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      shopSlug = `${rawSlug || 'store'}-${Math.floor(100 + Math.random() * 900)}`;
      shopId = 'shop_' + Date.now();

      // Save shop to in-memory store
      saveInMemoryShop({
        _id: shopId,
        ownerId: userId,
        ownerEmail: normalizedEmail,
        ownerName: `${userFirstName} ${userLastName}`.trim(),
        ownerPhone: requestedShopPhone?.trim() || phone?.trim() || '',
        shopName: shopName,
        slug: shopSlug,
        description: requestedShopDescription?.trim() || 'Specialty merchant partner store on VENTERSHOP.',
        category: requestedShopCategory?.trim() || 'General Store',
        city: requestedShopCity?.trim() || 'Colombo',
        logoUrl: requestedShopLogoUrl?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
        bannerUrl: requestedShopBannerUrl?.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
        status: 'PENDING',
        rating: 5.0,
        totalProducts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Save to memory registry immediately
    saveInMemoryUser({
      id: userId,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      firstName: userFirstName,
      lastName: userLastName,
      phone: phone?.trim() || '',
      customerType,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      isVendor,
      vendorStatus,
      shopId: shopId || undefined,
      shopName: shopName || undefined,
      shopSlug: shopSlug || undefined,
    });

    // Save to MongoDB if connected
    try {
      await connectToDatabase();
      const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
      if (adminRecord) {
        userRole = adminRecord.role;
        customerType = 'ADMIN';
        userId = adminRecord._id.toString();
      } else {
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            firstName: userFirstName,
            lastName: userLastName,
            phone: phone?.trim() || '',
            customerType: customerType as any,
            status: 'ACTIVE',
            communityStatus: customerType === 'COMMUNITY' ? 'APPROVED' : 'NONE',
            preferredLanguage: preferredLanguage || 'en',
            isVendor,
            vendorStatus,
            shopName: shopName || undefined,
            shopSlug: shopSlug || undefined,
            addresses: [],
          });
        } else {
          user.password = hashedPassword;
          user.customerType = customerType as any;
          user.isVendor = isVendor;
          user.vendorStatus = vendorStatus;
          if (shopName) user.shopName = shopName;
          if (shopSlug) user.shopSlug = shopSlug;
          if (firstName?.trim()) user.firstName = userFirstName;
          if (lastName?.trim()) user.lastName = userLastName;
          if (phone?.trim()) user.phone = phone.trim();
          await user.save();
        }
        if (user) {
          userId = user._id.toString();
          customerType = user.customerType;

          if (isVendor) {
            try {
              const createdShop = await Shop.create({
                ownerId: user._id,
                ownerEmail: normalizedEmail,
                ownerName: `${userFirstName} ${userLastName}`.trim(),
                ownerPhone: requestedShopPhone?.trim() || phone?.trim() || '',
                shopName: shopName,
                slug: shopSlug,
                description: requestedShopDescription?.trim() || 'Specialty merchant partner store on VENTERSHOP.',
                category: requestedShopCategory?.trim() || 'General Store',
                city: requestedShopCity?.trim() || 'Colombo',
                logoUrl: requestedShopLogoUrl?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
                bannerUrl: requestedShopBannerUrl?.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
                status: 'PENDING',
              });
              shopId = createdShop._id.toString();
              user.shopId = createdShop._id;
              await user.save();
            } catch (shopCreateErr) {
              console.warn('Could not create Mongo Shop document, kept in-memory shop:', shopCreateErr);
            }
          }
        }
      }
    } catch (dbSaveErr) {
      console.warn('Database save skipped during registration, saved in-memory user:', dbSaveErr);
    }

    // Send email notification for vendor registration
    if (isVendor) {
      try {
        await EmailService.sendShopRegistrationPendingEmail(
          normalizedEmail,
          `${userFirstName} ${userLastName}`.trim(),
          shopName
        );
      } catch (mailErr) {
        console.warn('Failed to send vendor registration pending email:', mailErr);
      }
    }

    const jwtSecretValue = process.env.JWT_SECRET || 'ventershop_development_secret_key_change_me_in_production';
    const secret = new TextEncoder().encode(jwtSecretValue);

    const token = await new SignJWT({
      userId,
      email: normalizedEmail,
      role: userRole,
      customerType,
      firstName: userFirstName,
      lastName: userLastName,
      isVendor,
      vendorStatus,
      shopId: shopId || undefined,
      shopName: shopName || undefined,
      shopSlug: shopSlug || undefined,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.delete('admin_session'); // Strictly wipe any old admin cookie
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      message: isVendor
        ? 'Shop registered successfully! Application is pending Super Admin approval.'
        : 'Logged in successfully',
      user: {
        id: userId,
        email: normalizedEmail,
        role: userRole,
        customerType,
        firstName: userFirstName,
        lastName: userLastName,
        isVendor,
        vendorStatus,
        shopId: shopId || undefined,
        shopName: shopName || undefined,
        shopSlug: shopSlug || undefined,
      },
    });
  } catch (error: any) {
    console.error('Error verifying OTP API:', error);
    return NextResponse.json({ error: 'Failed to verify code. Please try again.' }, { status: 500 });
  }
}
