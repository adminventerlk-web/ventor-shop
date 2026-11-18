'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Sparkles,
  Store,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
  PhoneCall,
  Clock,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  X,
  HelpCircle,
  Eye,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import AdvertisementStatusBadge from '@/components/ads/AdvertisementStatusBadge';

export default function AdvertiseWithUsPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [successData, setSuccessData] = useState<{ trackingCode: string } | null>(null);

  // Form Fields - Step 1: Business Information
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [category, setCategory] = useState('Groceries & Provisions');
  const [websiteOrSocial, setWebsiteOrSocial] = useState('');

  // Form Fields - Step 2: Advertisement Details
  const [advertisementTitle, setAdvertisementTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productsToPromote, setProductsToPromote] = useState('');
  const [preferredPlacement, setPreferredPlacement] = useState('HOMEPAGE_FEATURED');
  const [requestedStartDate, setRequestedStartDate] = useState('');
  const [requestedEndDate, setRequestedEndDate] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');

  // Form Fields - Step 3: Media Submission
  const [logo, setLogo] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Step 4: Terms
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status Lookup Tool
  const [lookupCode, setLookupCode] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any[] | null>(null);
  const [lookupError, setLookupError] = useState('');

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({ 0: true });

  // Client-side Canvas Image Compression
  const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const compressed = await compressImage(file, 400, 400, 0.9);
      setLogo(compressed);
    } catch (err) {
      alert('Failed to process logo image.');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 8) {
      alert('You can upload up to 8 promotional images per advertisement request.');
      return;
    }

    setUploadingImages(true);
    try {
      const promises = Array.from(files).map((f) => compressImage(f, 1200, 1200, 0.85));
      const compressedList = await Promise.all(promises);
      setImages((prev) => [...prev, ...compressedList]);
    } catch (err) {
      alert('Failed to process promotional images.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!businessName.trim() || !ownerName.trim() || !email.trim() || !phone.trim() || !shopLocation.trim()) {
      alert('Please complete all required business information fields.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!advertisementTitle.trim() || !description.trim()) {
      alert('Please enter an Advertisement Title and Description.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (images.length === 0) {
      alert('Please upload at least one promotional image from your device.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (activeStep === 1 && !validateStep1()) return;
    if (activeStep === 2 && !validateStep2()) return;
    if (activeStep === 3 && !validateStep3()) return;
    setActiveStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSubmitRequest = async () => {
    if (!agreeTerms) {
      alert('Please accept the VentorShop Advertising Terms and Conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        businessName,
        ownerName,
        email,
        phone,
        shopLocation,
        category,
        websiteOrSocial,
        advertisementTitle,
        description,
        productsToPromote,
        preferredPlacement,
        requestedStartDate: requestedStartDate || undefined,
        requestedEndDate: requestedEndDate || undefined,
        logo,
        images,
        destinationUrl,
      };

      const res = await fetch('/api/advertise/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData({ trackingCode: data.trackingCode });
      } else {
        alert(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting advertisement request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim() && !lookupEmail.trim()) {
      setLookupError('Enter either your tracking code or registered email address.');
      return;
    }

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const query = new URLSearchParams();
      if (lookupCode.trim()) query.append('trackingCode', lookupCode.trim());
      if (lookupEmail.trim()) query.append('email', lookupEmail.trim());

      const res = await fetch(`/api/advertise/request?${query.toString()}`);
      const data = await res.json();

      if (res.ok && data.requests) {
        setLookupResult(data.requests);
      } else {
        setLookupError(data.error || 'No matching request found.');
      }
    } catch (err) {
      setLookupError('Failed to lookup request.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans pb-16">
      {/* ── HERO BANNER ── */}
      <section
        className="relative overflow-hidden text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#FFB800]"
        style={{
          backgroundColor: '#021838',
          backgroundImage:
            'radial-gradient(ellipse at 85% 15%, rgba(0, 82, 204, 0.45) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255, 184, 0, 0.2) 0%, transparent 65%), linear-gradient(135deg, #021838 0%, #052357 50%, #010E24 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>VENTERSHOP ADVERTISING MARKETPLACE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Grow Your Business with VentorShop
          </h1>

          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Promote your shop, reach more customers, and showcase your products to a wider audience through
            VentorShop. Integrated directly into Sri Lanka’s premier digital e-commerce ecosystem.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById('ad-request-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#FFB800] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-[#021838] font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Advertisement Request
            </button>

            <a
              href="https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20want%20to%20advertise%20my%20store%20on%20VENTERSHOP."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp: 077 833 1202</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 4 ADVERTISING BENEFITS ── */}
      <section className="max-w-6xl mx-auto -mt-10 px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <TrendingUp className="w-6 h-6 text-[#FFB800]" />,
              title: '50K+ Monthly Shoppers',
              desc: 'High-intent online buyers actively browsing groceries, fashion, books, and provisions across Sri Lanka.',
            },
            {
              icon: <Store className="w-6 h-6 text-emerald-400" />,
              title: 'Dedicated Virtual Storefront',
              desc: 'Custom storefront URL with branded hero cover, inventory catalogue, and direct cart checkout.',
            },
            {
              icon: <Layers className="w-6 h-6 text-blue-400" />,
              title: 'Dynamic Multi-Image Cards',
              desc: 'Your promotional photos are automatically formatted into balanced 1, 2, 3, 4, or 5+ image displays.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-[#FFB800]" />,
              title: 'Zero Setup Fees',
              desc: 'Free to apply. Direct bank transfer payouts, automated order alerts, and 24h merchant hotline.',
            },
          ].map((b, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow space-y-2.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#021838] flex items-center justify-center shadow-md">
                {b.icon}
              </div>
              <h3 className="font-black text-base text-[#021838]">{b.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-[#0052CC] tracking-widest">
            SIMPLE 3-STEP COLLABORATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#021838]">
            How Commercial Advertising Works on VentorShop
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#0052CC] text-white font-black text-sm flex items-center justify-center shadow-sm">
              1
            </span>
            <h3 className="font-black text-base text-[#021838]">Submit Request</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fill out the 4-step form below with your business details, promotion title, target link, and upload
              your high-resolution photos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#FFB800] text-[#021838] font-black text-sm flex items-center justify-center shadow-sm">
              2
            </span>
            <h3 className="font-black text-base text-[#021838]">Admin Review (24 Hours)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our merchant team verifies your store details, optimizes your promotional images, and schedules your
              ad placement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              3
            </span>
            <h3 className="font-black text-base text-[#021838]">Live Billboard Promotion</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your advertisement goes live on VentorShop’s homepage, category sections, and discover portals, driving
              instant traffic!
            </p>
          </div>
        </div>
      </section>

      {/* ── MULTI-STEP ADVERTISEMENT REQUEST FORM ── */}
      <section id="ad-request-form-section" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-[#021838] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#FFB800]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#0052CC] text-[#FFB800]">
                  <Megaphone className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Collaborator Advertisement Application
                </h2>
              </div>
              <p className="text-xs text-blue-200 mt-1 font-medium">
                Step {activeStep} of 4 • Complete the details to submit your commercial promotion.
              </p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all ${
                    activeStep === step
                      ? 'bg-[#FFB800] text-[#021838] scale-110 shadow-md ring-2 ring-white/50'
                      : activeStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {activeStep > step ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {successData ? (
              /* Success Screen */
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#021838]">Advertisement Request Submitted!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{ownerName}</strong>! Your application for <strong>{businessName}</strong> has
                  been received. Our merchant review team will inspect your media and contact you within 24 hours.
                </p>

                {/* Tracking Code Card */}
                <div className="p-5 bg-blue-50 border-2 border-dashed border-[#0052CC] rounded-2xl max-w-md mx-auto space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0052CC]">
                    YOUR TRACKING CODE
                  </span>
                  <p className="text-2xl font-mono font-black text-[#021838]">{successData.trackingCode}</p>
                  <p className="text-xs text-gray-500">Keep this reference code to track your approval status below.</p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/94778331202?text=Hello%20VentorShop%20Team%2C%20I%20have%20submitted%20an%20ad%20request%20with%20tracking%20code%20${successData.trackingCode}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Confirm via WhatsApp (Fast-Track)</span>
                  </a>

                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setActiveStep(1);
                      setImages([]);
                      setLogo('');
                    }}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1: BUSINESS INFORMATION */}
                {activeStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b pb-2">
                      <h3 className="text-base font-black text-[#021838]">Step 1: Business Information</h3>
                      <p className="text-xs text-gray-500">Tell us about your shop or enterprise.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Business / Shop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Ceylon Royal Spices"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Owner / Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="e.g. Subendra Navaratnam"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. owner@store.com"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          WhatsApp / Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 077 833 1202"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Shop City / Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shopLocation}
                          onChange={(e) => setShopLocation(e.target.value)}
                          placeholder="e.g. Jaffna / Colombo / Kandy"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">Business Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        >
                          <option value="Groceries & Provisions">Groceries & Provisions</option>
                          <option value="Ceylon Spices & Agri Export">Ceylon Spices & Agri Export</option>
                          <option value="Books & Stationery">Books & Stationery</option>
                          <option value="Animal Feed & Veterinary">Animal Feed & Veterinary</option>
                          <option value="Handloom & Apparel">Handloom & Apparel</option>
                          <option value="Electronics & Accessories">Electronics & Accessories</option>
                          <option value="General Store">General Store</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-800 mb-1">
                        Existing Website or Facebook / Instagram Page URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={websiteOrSocial}
                        onChange={(e) => setWebsiteOrSocial(e.target.value)}
                        placeholder="e.g. https://instagram.com/yourshop or https://yourshop.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: ADVERTISEMENT DETAILS */}
                {activeStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b pb-2">
                      <h3 className="text-base font-black text-[#021838]">Step 2: Advertisement Details</h3>
                      <p className="text-xs text-gray-500">Configure your commercial pitch and target promotion.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-800 mb-1">
                        Advertisement Headline / Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={advertisementTitle}
                        onChange={(e) => setAdvertisementTitle(e.target.value)}
                        placeholder="e.g. Pure Ceylon Cinnamon & Export Spices - 20% Off This Week!"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-800 mb-1">
                        Advertisement Description / Offer Details <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what makes your products special, delivery coverage, and why customers should click..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-800 mb-1">
                        Products or Services to Promote
                      </label>
                      <input
                        type="text"
                        value={productsToPromote}
                        onChange={(e) => setProductsToPromote(e.target.value)}
                        placeholder="e.g. Alba Cinnamon sticks, cardamom pods, organic black pepper"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Preferred Advertisement Placement
                        </label>
                        <select
                          value={preferredPlacement}
                          onChange={(e) => setPreferredPlacement(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        >
                          <option value="HOMEPAGE_FEATURED">Homepage Hero Billboard (Top Visibility)</option>
                          <option value="DISCOVER_SHOPS">Discover Shops & Marketplace Section</option>
                          <option value="SPECIAL_OFFERS">Special Deals & Offers Section</option>
                          <option value="CATEGORY_PAGE">Category Specific Promotion</option>
                          <option value="SHOP_PAGE">Store Page Showcase</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Destination Page / Shop Link
                        </label>
                        <input
                          type="text"
                          value={destinationUrl}
                          onChange={(e) => setDestinationUrl(e.target.value)}
                          placeholder="e.g. /shops/your-shop or external website"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold focus:border-[#0052CC] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Expected Start Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={requestedStartDate}
                          onChange={(e) => setRequestedStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-800 mb-1">
                          Expected End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={requestedEndDate}
                          onChange={(e) => setRequestedEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-semibold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: MEDIA SUBMISSION (DYNAMIC MULTI-IMAGE UPLOAD) */}
                {activeStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b pb-2">
                      <h3 className="text-base font-black text-[#021838]">Step 3: Media Submission</h3>
                      <p className="text-xs text-gray-500">
                        Upload your shop logo and 1 to 8 promotional photos. Our platform automatically formats
                        them into dynamic 1, 2, 3, 4, or 5+ image layouts!
                      </p>
                    </div>

                    {/* Logo Upload Box */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {logo ? (
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#0052CC] bg-white shadow-xs shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logo} alt="Shop Logo" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Store className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-black text-gray-900">Shop Logo / Avatar</p>
                          <p className="text-[11px] text-gray-500 font-medium">Square PNG or JPG recommended.</p>
                        </div>
                      </div>

                      <label className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 cursor-pointer shadow-xs transition-colors shrink-0">
                        <span>{uploadingLogo ? 'Compressing...' : logo ? 'Change Logo' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>

                    {/* Promotional Images Upload (Multiple) */}
                    <div className="border-2 border-dashed border-[#0052CC]/50 rounded-3xl p-6 bg-blue-50/30 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#0052CC] text-[#FFB800] flex items-center justify-center mx-auto shadow-md">
                        <UploadCloud className="w-7 h-7" />
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-[#021838]">
                          Upload Promotional Photos From Your Device (Phone / PC)
                        </h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto mt-0.5">
                          Select 1 to 8 high-resolution photos of your products, workshop, or storefront. Photos are
                          automatically optimized for fast loading.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer">
                        <UploadCloud className="w-4 h-4" />
                        <span>{uploadingImages ? 'Compressing Photos...' : 'Choose Photos from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImagesUpload}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>

                    {/* Uploaded Images Preview Grid */}
                    {images.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-gray-800">
                            Uploaded Promotional Photos ({images.length} / 8):
                          </p>
                          <span className="text-[11px] font-bold text-emerald-600">
                            ✓ Layout will auto-adapt to {images.length} image{images.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative rounded-2xl overflow-hidden border-2 border-gray-300 h-28 group bg-black shadow-xs"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={`Uploaded ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-black text-white">
                                #{idx + 1} {idx === 0 ? '(Hero)' : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: REVIEW & SUBMIT */}
                {activeStep === 4 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b pb-2">
                      <h3 className="text-base font-black text-[#021838]">Step 4: Review and Submit</h3>
                      <p className="text-xs text-gray-500">Please review all submitted information before confirming.</p>
                    </div>

                    {/* Review Summary Grid */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b pb-3">
                        <div>
                          <span className="text-gray-500 font-bold block">Shop / Business:</span>
                          <span className="font-black text-gray-900 text-sm">{businessName}</span>
                          <span className="text-gray-600 block">{category} • {shopLocation}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold block">Applicant Contact:</span>
                          <span className="font-bold text-gray-900">{ownerName}</span>
                          <span className="text-gray-600 block">{phone} • {email}</span>
                        </div>
                      </div>

                      <div className="border-b pb-3 space-y-1">
                        <span className="text-gray-500 font-bold block">Advertisement Pitch:</span>
                        <p className="font-black text-sm text-[#0052CC]">{advertisementTitle}</p>
                        <p className="text-gray-700 leading-relaxed font-medium">{description}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-gray-500 font-bold block">Placement:</span>
                          <span className="font-bold text-gray-900">{preferredPlacement}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold block">Photos Attached:</span>
                          <span className="font-bold text-emerald-600">{images.length} Images</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold block">Setup Fee:</span>
                          <span className="font-black text-emerald-600">LKR 0.00 (Free)</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold block">Destination:</span>
                          <span className="font-bold text-gray-900 truncate block">
                            {destinationUrl || '/virtual-shops'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Terms Acceptance Checkbox */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-[#0052CC] focus:ring-blue-500 cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-gray-700 leading-relaxed">
                          I agree to the VentorShop Commercial Partnership Terms & Advertising Guidelines. I confirm
                          that the provided store information and promotional images are authentic and comply with
                          applicable commercial regulations.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Navigation Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
                  {activeStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {activeStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitRequest}
                      disabled={isSubmitting || !agreeTerms}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting Application...' : 'Submit Advertisement Request'}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── TRACK ADVERTISEMENT APPLICATION STATUS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0052CC]">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-base text-[#021838]">Track Your Advertisement Status</h3>
              <p className="text-xs text-gray-500">
                Already submitted an advertisement request? Enter your Tracking Code or registered Email to check
                approval progress.
              </p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder="Tracking Code (e.g. AD-REQ-ABC123)"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-[#0052CC]"
              />
            </div>
            <div className="sm:col-span-5">
              <input
                type="email"
                placeholder="Or Registered Email Address"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-[#0052CC]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full h-full py-2.5 bg-[#021838] hover:bg-[#0052CC] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {lookupLoading ? 'Checking...' : 'Check'}
              </button>
            </div>
          </form>

          {lookupError && <p className="text-xs font-bold text-red-600">{lookupError}</p>}

          {/* Lookup Results */}
          {lookupResult && lookupResult.length > 0 && (
            <div className="pt-3 space-y-3">
              {lookupResult.map((r) => (
                <div
                  key={r._id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#0052CC]">{r.trackingCode}</span>
                      <AdvertisementStatusBadge status={r.status} />
                    </div>
                    <p className="font-bold text-gray-900">{r.businessName} — {r.advertisementTitle}</p>
                    <p className="text-gray-500 text-[11px]">
                      Submitted on {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    {r.adminFeedback && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium mt-2">
                        <strong>Admin Feedback:</strong> {r.adminFeedback}
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/94778331202?text=Hello%20VentorShop%2C%20inquiring%20about%20my%20ad%20tracking%20code%20${r.trackingCode}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp Follow-up</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ── */}
      <section className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1 pb-4">
          <span className="text-xs font-black uppercase text-[#0052CC] tracking-widest">HELP & FAQ</span>
          <h2 className="text-2xl font-black text-[#021838]">Advertising Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How long does it take for my advertisement request to be approved?',
              a: 'Our merchant verification team reviews all collaborator submissions within 24 to 48 business hours. If any additional photos or verification documents are required, we contact you directly via WhatsApp.',
            },
            {
              q: 'What is the cost of advertising on VentorShop?',
              a: 'Submitting an advertisement request is completely free. We offer promotional partnership packages with zero upfront setup fees, as well as revenue-sharing and sponsored showcase models.',
            },
            {
              q: 'How many photos can I include in my advertisement?',
              a: 'You can upload 1 to 8 images per advertisement. Our platform dynamically adapts the layout: 1 image becomes a hero banner, 2 images form a balanced split, 3 images create an asymmetric showcase, 4 images form a 2x2 grid, and 5+ images display an interactive carousel with thumbnail strip.',
            },
            {
              q: 'Can I advertise if I don’t have an existing online store?',
              a: 'Yes! We can set up a dedicated virtual shop on VentorShop (e.g. ventor-shop.vercel.app/shops/your-name) where customers can order your products directly using Cash on Delivery (COD) or Bank Transfer.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-black text-sm text-[#021838] cursor-pointer"
              >
                <span>{faq.q}</span>
                {faqOpen[idx] ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>
              {faqOpen[idx] && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed font-medium border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
