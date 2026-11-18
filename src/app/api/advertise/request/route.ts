import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import AdvertisementRequest from '@/models/AdvertisementRequest';

// POST: Submit a new collaborator advertisement request
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      businessName,
      ownerName,
      email,
      phone,
      category,
      shopLocation,
      websiteOrSocial,
      advertisementTitle,
      description,
      productsToPromote,
      preferredPlacement,
      requestedStartDate,
      requestedEndDate,
      logo,
      images,
      destinationUrl,
    } = body;

    // Validate required fields
    if (!businessName?.trim() || !ownerName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Business name, owner name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    if (!advertisementTitle?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Advertisement title and description are required.' },
        { status: 400 }
      );
    }

    const imagesArray = Array.isArray(images) && images.length > 0 ? images : [];
    if (imagesArray.length === 0) {
      return NextResponse.json(
        { error: 'Please upload at least one promotional image for the advertisement.' },
        { status: 400 }
      );
    }

    // Generate unique 6-digit alphanumeric tracking code: AD-REQ-XXXXXX
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackingCode = `AD-REQ-${randomChars}`;

    const newRequest = await AdvertisementRequest.create({
      trackingCode,
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      category: category?.trim() || 'General Store',
      shopLocation: shopLocation?.trim() || 'Colombo',
      websiteOrSocial: websiteOrSocial?.trim() || '',
      advertisementTitle: advertisementTitle.trim(),
      description: description.trim(),
      productsToPromote: productsToPromote?.trim() || '',
      preferredPlacement: preferredPlacement || 'HOMEPAGE_FEATURED',
      requestedStartDate: requestedStartDate ? new Date(requestedStartDate) : undefined,
      requestedEndDate: requestedEndDate ? new Date(requestedEndDate) : undefined,
      logo: logo || '',
      images: imagesArray,
      destinationUrl: destinationUrl?.trim() || '',
      status: 'PENDING',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your advertisement request has been submitted successfully! Our team will review it within 24 hours.',
        trackingCode,
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in /api/advertise/request POST:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit advertisement request.' },
      { status: 500 }
    );
  }
}

// GET: Check request status by trackingCode or email
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const trackingCode = searchParams.get('trackingCode');
    const email = searchParams.get('email');

    if (!trackingCode && !email) {
      return NextResponse.json(
        { error: 'Please provide either trackingCode or email to track advertisement request.' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (trackingCode) query.trackingCode = trackingCode.trim().toUpperCase();
    if (email) query.email = email.trim().toLowerCase();

    const requests = await AdvertisementRequest.find(query).sort({ createdAt: -1 }).lean();

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        { error: 'No advertisement request found with the provided details.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    console.error('Error in /api/advertise/request GET:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to look up advertisement request.' },
      { status: 500 }
    );
  }
}
