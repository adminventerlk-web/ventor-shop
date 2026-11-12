'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Globe,
  Plane,
  Ship,
  Package,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  TrendingUp,
} from 'lucide-react';

export default function ExportClient() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    productCategory: 'Groceries & Spices',
    expectedVolume: '1 - 5 Tons (FCL/LCL)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const exportCategories = [
    {
      title: isTa ? 'இலங்கை மளிகை & மசாலா பொருட்கள்' : 'Sri Lankan Spices & Groceries',
      desc: isTa ? 'உண்மையான இலங்கை இலவங்கப்பட்டை, மிளகு, ஏலக்காய், தேயிலை மற்றும் பாரம்பரிய உணவுப் பொருட்கள்.' : 'Authentic Ceylon Cinnamon, Black Pepper, Cardamom, Pure Ceylon Tea, and traditional food items.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isTa ? 'ராணி கால்நடை தீவனங்கள்' : 'Rani Animal & Livestock Feed',
      desc: isTa ? 'உயர்தர கோழி, மாடு மற்றும் ஆடு ஊட்டச்சத்து தீவனங்கள் பல்க் ஏற்றுமதிக்கு தயார்.' : 'High-grade livestock, poultry, and animal nutrition feeds ready for bulk commercial shipping.',
      image: '/images/rani_animal_feed.jpg',
    },
    {
      title: isTa ? 'ஆயுர்வேதம் & இயற்கை நல்வாழ்வு' : 'Ayurvedic & Herbal Wellness',
      desc: isTa ? 'தூய மூலிகை மருந்துகள், ஆயுர்வேத எண்ணெய்கள் மற்றும் இயற்கை அழகு சாதனங்கள்.' : 'Certified herbal wellness supplements, cold-pressed oils, and traditional wellness products.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: isTa ? 'கைவினைப் பொருட்கள் & ஜவுளி' : 'Handicrafts & Textile Apparel',
      desc: isTa ? 'இலங்கை கைவினைப் பொருட்கள், பத்திக் மற்றும் ஆடைகள் உலகளாவிய விநியோகத்திற்கு.' : 'Handmade eco-friendly crafts, handloom apparel, and bespoke Ceylon products.',
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const highlights = [
    {
      icon: ShieldCheck,
      title: isTa ? 'ஏற்றுமதி தரச்சான்றிதழ்' : 'Certified Export Quality',
      desc: isTa ? 'சர்வதேச தரக் கட்டுப்பாட்டு விதிமுறைகளுடன் கூடிய ஏற்றுமதி தயாரிப்புகள்.' : 'Full international phytosanitary, ISO, and export compliant certifications.',
    },
    {
      icon: Ship,
      title: isTa ? 'உலகளாவிய கடல் & வான்வழி ஷிப்பிங்' : 'Sea & Air Freight Logistics',
      desc: isTa ? 'FCL / LCL கண்டெய்னர்கள் மற்றும் துரித விமான சரக்கு போக்குவரத்து.' : 'Worldwide FCL/LCL sea cargo and priority air freight door-to-port solutions.',
    },
    {
      icon: TrendingUp,
      title: isTa ? 'நேரடி உற்பத்தியாளர் விலை' : 'Direct Producer Pricing',
      desc: isTa ? 'இடைத்தரகர்கள் இன்றி உற்பத்தியாளர்களிடம் இருந்து நேரடி மொத்த விலை.' : 'Competitive manufacturer-direct rates with progressive volume tier discounts.',
    },
    {
      icon: Package,
      title: isTa ? 'தனிப்பயன் லேபிளிங் & பேக்கிங்' : 'Custom OEM & Private Label',
      desc: isTa ? 'உங்கள் பிராண்ட் பெயரில் பிரத்யேக பேக்கிங் வசதி.' : 'Customized packaging, barcoding, and private labeling options for retail chains.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] [&>header]:bg-none! [&>header]:bg-inherit! [&_a]:focus-visible:outline-3 [&_a]:focus-visible:outline-offset-3 [&_a]:focus-visible:outline-[#0759D6] [&_button]:focus-visible:outline-3 [&_button]:focus-visible:outline-offset-3 [&_button]:focus-visible:outline-[#0759D6] motion-reduce:[&_*]:transition-none! font-sans antialiased text-xs font-semibold">
      
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-inherit" />}>
        <Header />
      </Suspense>

      {/* Export portal hero */}
      <section aria-labelledby="export-hero-heading" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-4">
        <div data-export-hero className="relative isolate overflow-hidden rounded-[36px] border border-[#4d80cc]/30 bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-[0_16px_40px_-22px_#071f5070] sm:p-9 lg:flex lg:h-[340px] lg:items-center lg:px-12 lg:py-6">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[520px] w-[620px] -rotate-12 rounded-[50%] border border-white/10 bg-linear-to-br from-[#247bec]/30 to-[#0759D6]/5" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-64 -z-10 h-[540px] w-[640px] rounded-[50%] border border-white/5 bg-linear-to-b from-[#4d92f2]/15 to-transparent" />
          <div className="grid w-full min-w-0 items-center gap-7 lg:grid-cols-[1.65fr_1fr] xl:grid-cols-[1.2fr_1fr] lg:gap-10">
            <div className="min-w-0 space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[#dceaff] text-[11px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{isTa ? 'இலங்கை ஏற்றுமதி மையம்' : 'Global Export Portal'}</span>
              </div>
              
              <h1 id="export-hero-heading" className="text-[28px] sm:text-[34px] lg:text-[30px] xl:text-[38px] font-serif font-bold tracking-[-.025em] leading-[1.12]">
                {isTa
                  ? 'இலங்கையிலிருந்து உலக நாடுகளுக்கு நேரடி ஏற்றுமதி'
                  : <>Direct Global Export from <span className="text-[#FFC400]">Sri Lanka</span> to the World</>}
              </h1>
              
              <p className="text-xs sm:text-sm text-[#dceaff] font-medium leading-relaxed max-w-xl">
                {isTa
                  ? 'இலங்கையின் தலைசிறந்த மளிகைப் பொருட்கள், மசாலாக்கள், ராணி கால்நடை தீவனங்கள் மற்றும் பாரம்பரிய உற்பத்திகளை உலகளாவிய பல்க் கொள்முதலுக்கு VENTERSHOP மூலம் பாதுகாப்பாகப் பெறுங்கள்.'
                  : 'Source authentic Sri Lankan Ceylon spices, fresh groceries, Rani animal feed, and manufactured goods directly from verified suppliers. Seamless bulk supply with international shipping.'}
              </p>

              <div className="pt-1 flex flex-wrap gap-3">
                <a
                  href="#inquiry-form"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FFC400] px-5 py-3 font-bold text-[#071F50] transition-colors hover:bg-[#efb900]"
                >
                  <span>{isTa ? 'ஏற்றுமதி விபரங்களை கோருங்கள்' : 'Request Export Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 py-3 font-bold text-white transition-colors hover:bg-white/20"
                >
                  {isTa ? 'பொருட்களைப் பார்க்க' : 'Browse Store Catalog'}
                </Link>
              </div>
            </div>


            <div role="img" aria-label="International cargo ship, shipping containers and freight aircraft" className="relative mx-auto h-[220px] w-full max-w-[380px] text-white sm:h-[240px]">
              <Globe aria-hidden="true" strokeWidth={.7} className="absolute right-8 top-0 h-48 w-48 text-[#82b8ff]/30" />
              <Plane aria-hidden="true" className="absolute right-2 top-3 h-16 w-16 -rotate-12 text-[#FFC400] drop-shadow-lg" />
              <div aria-hidden="true" className="absolute inset-x-8 bottom-10 flex items-end gap-2">
                <div className="h-20 flex-1 rounded-lg border border-white/30 bg-[#0759D6] bg-[repeating-linear-gradient(90deg,transparent_0_12px,#ffffff20_12px_14px)] shadow-xl" />
                <div className="h-28 flex-1 rounded-lg border border-[#ffe380] bg-[#FFC400] bg-[repeating-linear-gradient(90deg,transparent_0_12px,#082b6820_12px_14px)] shadow-xl"><Package className="mx-auto mt-5 h-10 w-10 text-[#082B68]" /></div>
                <div className="h-16 flex-1 rounded-lg border border-white/30 bg-[#dceaff] bg-[repeating-linear-gradient(90deg,transparent_0_12px,#0759d620_12px_14px)] shadow-xl" />
              </div>
              <div aria-hidden="true" className="absolute inset-x-2 bottom-2 flex h-14 items-center justify-center rounded-b-[60px] border-t-4 border-[#dceaff] bg-[#071F50] shadow-xl"><Ship className="h-10 w-10 text-[#dceaff]" /></div>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Freight forwarding information" className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
              <div className="grid gap-5 rounded-3xl border border-[#c7def5] bg-white p-5 text-[#082B68] shadow-sm lg:grid-cols-[1fr_1.6fr] lg:items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#0759D6] flex items-center justify-center font-black">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#082B68]">
                      {isTa ? 'சர்வதேச சரக்கு விநியோகம்' : 'Worldwide Freight Forwarding'}
                    </h3>
                    <p className="text-[11px] text-[#526681]">Door-to-Port & Door-to-Door Delivery</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[#526681]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0759D6] shrink-0" />
                    <span>Serving Canada, UK, Europe, USA, UAE & Australia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0759D6] shrink-0" />
                    <span>Strict Quality Assurance & Phytosanitary Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0759D6] shrink-0" />
                    <span>Dedicated Export Account Manager</span>
                  </div>
                </div>
              </div>
      </section>

      {/* 2. EXPORT ADVANTAGES / HIGHLIGHTS */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isTa ? 'ஏன் VENTERSHOP ஏற்றுமதி?' : 'Why Export With VENTERSHOP?'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#082B68]">
              {isTa ? 'உங்கள் நம்பகமான சர்வதேச விநியோக கூட்டாளி' : 'Your Trusted International Supply Partner'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-[#c7def5] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 motion-reduce:hover:translate-y-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0759D6] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-[#082B68]">{h.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EXPORT PRODUCT CATEGORIES */}
      <section className="pb-10 sm:pb-12 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isTa ? 'ஏற்றுமதி பிரிவுகள்' : 'Export Ready Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#082B68]">
              {isTa ? 'முன்னணி இலங்கை ஏற்றுமதி தயாரிப்புகள்' : 'Key Sri Lankan Export Lines'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exportCategories.map((cat, idx) => (
              <div key={idx} className="group bg-white rounded-3xl border border-[#c7def5] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 motion-reduce:hover:translate-y-0 flex flex-col">
                <div className="h-44 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${cat.image}')` }}>
                  <div className="w-full h-full bg-gradient-to-t from-black/50 via-transparent group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-[#082B68]">{cat.title}</h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
                  </div>
                  <a
                    href="#inquiry-form"
                    className="pt-3 text-[#0759D6] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <span>Inquire for Bulk Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INQUIRY FORM SECTION */}
      <section id="inquiry-form" className="pb-12 sm:pb-14 scroll-mt-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#c7def5] shadow-xl p-6 sm:p-10 space-y-6">
            
            <div className="text-center space-y-2 border-b border-gray-100 pb-6">
              <span className="text-[10px] font-extrabold text-[#0759D6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {isTa ? 'நேரடி தொடர்பு & மேற்கோள்' : 'Commercial Export Quote'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082B68]">
                {isTa ? 'ஏற்றுமதி கொள்முதல் படிவம்' : 'Submit an Export / Bulk Supply Inquiry'}
              </h2>
              <p className="text-xs text-gray-500 font-medium max-w-lg mx-auto">
                {isTa
                  ? 'உங்கள் நிறுவனத்தின் தேவைகளை கீழே உள்ள படிவத்தில் பூர்த்தி செய்யுங்கள். எங்கள் ஏற்றுமதி நிர்வாகக் குழு 24 மணி நேரத்திற்குள் உங்களைத் தொடர்புகொள்ளும்.'
                  : 'Fill in your business requirements below. Our global export desk will get back to you with FOB/CIF pricing within 24 hours.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 text-green-900">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-black">Thank You! Inquiry Received</h3>
                <p className="text-xs text-green-800 max-w-md mx-auto">
                  Your export inquiry has been logged. Our international sales desk will contact you via email ({form.email}) shortly with quotation and shipping schedules.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      businessName: '',
                      contactName: '',
                      email: '',
                      phone: '',
                      country: '',
                      productCategory: 'Groceries & Spices',
                      expectedVolume: '1 - 5 Tons (FCL/LCL)',
                      message: '',
                    });
                  }}
                  className="mt-4 px-6 py-2 bg-[#0759D6] text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Company / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global Foods Trading Ltd"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Destination Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Canada, UK, Australia"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Product of Interest *</label>
                    <select
                      value={form.productCategory}
                      onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 cursor-pointer font-bold text-[#082B68]"
                    >
                      <option value="Groceries & Spices">Sri Lankan Spices & Ceylon Tea</option>
                      <option value="Rani Animal Feed">Rani Animal & Livestock Feed</option>
                      <option value="Ayurvedic Products">Ayurvedic & Herbal Supplements</option>
                      <option value="Handicrafts & Apparel">Handicrafts & Textiles</option>
                      <option value="Mixed Container">Mixed Container / Multiple Categories</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#082B68] font-bold">Expected Order Volume *</label>
                    <select
                      value={form.expectedVolume}
                      onChange={(e) => setForm({ ...form, expectedVolume: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 cursor-pointer font-bold text-[#082B68]"
                    >
                      <option value="LCL Partial Container (500kg - 2 Tons)">LCL Partial Container (500kg - 2 Tons)</option>
                      <option value="1x 20ft FCL Container">1x 20ft FCL Container (~10-15 Tons)</option>
                      <option value="1x 40ft HQ Container">1x 40ft HQ Container (~22-26 Tons)</option>
                      <option value="Air Cargo Priority (100kg - 1 Ton)">Air Cargo Priority (100kg - 1 Ton)</option>
                      <option value="Sample Evaluation Pack">Sample Evaluation Pack First</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#082B68] font-bold">Inquiry Details / Specific SKUs</label>
                  <textarea
                    rows={4}
                    placeholder="Specify desired packaging sizes, target delivery dates, or special certification needs..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-[#0759D6] hover:bg-[#082B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-gray-400"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Send Export Inquiry'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
