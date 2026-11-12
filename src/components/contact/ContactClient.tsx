'use client';

import React, { useState, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Headphones, MessageCircle, Globe } from 'lucide-react';

export default function ContactClient() {
  const { language } = useTranslation();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF5FF] [&>header]:bg-none! [&>header]:bg-inherit! text-xs font-semibold">
      <Suspense fallback={<div className="h-20 bg-inherit" />}>
        <Header />
      </Suspense>

      <main className="flex-grow max-w-7xl w-full mx-auto pt-6 pb-12 px-4 sm:px-6 sm:pt-8 lg:px-8 lg:pt-4 space-y-8">
        <section aria-label="Contact introduction" data-contact-hero className="relative isolate overflow-hidden rounded-[36px] border border-[#4d80cc]/30 bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-[0_16px_40px_-22px_#071f5070] sm:p-9 lg:flex lg:h-[300px] lg:items-center lg:px-12 lg:py-6">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[520px] w-[620px] -rotate-12 rounded-[50%] border border-white/10 bg-linear-to-br from-[#247bec]/30 to-[#0759D6]/5" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-64 -z-10 h-[540px] w-[640px] rounded-[50%] border border-white/5 bg-linear-to-b from-[#4d92f2]/15 to-transparent" />
          <div className="grid w-full items-center gap-6 md:grid-cols-[1.4fr_1fr] lg:gap-10">
        {/* Page title banner */}
        <div className="relative z-10 min-w-0 space-y-3">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[#dceaff]">
            {language === 'ta' ? 'தொடர்பு கொள்ள' : 'GET IN TOUCH'}
          </span>
          <h1 className="font-serif text-3xl sm:text-[44px] font-bold leading-[1.12] text-white tracking-tight">
            {language === 'ta' ? 'எங்களை தொடர்பு கொள்ள' : <>Contact <span className="text-[#FFC400]">Us</span></>}
          </h1>
          <p className="max-w-xl text-sm text-[#dceaff] font-medium leading-relaxed">
            Have questions about orders, B2B wholesale applications, export inquiries, or community group discount vouchers? Send us a message and our support desk will reply shortly.
          </p>
        </div>


            <div role="img" aria-label="Customer support headset with email and message icons" className="relative mx-auto h-44 w-full max-w-[280px] sm:h-48">
              <div aria-hidden="true" className="absolute inset-x-12 inset-y-1 rounded-full border border-white/15 bg-white/5" />
              <Headphones aria-hidden="true" strokeWidth={1.3} className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-xl" />
              <span className="absolute bottom-3 left-1 flex h-16 w-20 -rotate-12 items-center justify-center rounded-2xl border border-white/30 bg-[#0759D6] shadow-xl"><Mail aria-hidden="true" className="h-9 w-9 text-white" /></span>
              <span className="absolute right-1 top-3 flex h-16 w-20 rotate-12 items-center justify-center rounded-2xl bg-[#FFC400] shadow-xl"><MessageCircle aria-hidden="true" className="h-9 w-9 text-[#071F50]" /></span>
            </div>
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#c7def5] shadow-[0_8px_24px_-16px_#082b6333] space-y-6">
            <h2 className="text-base font-extrabold text-[#082B68] uppercase tracking-wider border-b border-[#dceaff] pb-3">
              Send Message
            </h2>

            {success && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl font-extrabold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your message has been received. Our team will contact you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#082B68] font-bold block mb-1" htmlFor="contact-name">Full Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#082B68] font-bold block mb-1" htmlFor="contact-email">Email Address *</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#082B68] font-bold block mb-1" htmlFor="contact-subject">Subject *</label>
                <input
                  type="text"
                  id="contact-subject"
                    name="subject"
                  required
                  value={form.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#082B68] font-bold block mb-1" htmlFor="contact-message">Message Content *</label>
                <textarea
                  id="contact-message"
                    name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg outline-none focus:bg-white focus:border-[#0759D6] focus:ring-2 focus:ring-[#0759D6]/15 text-[#082B68] font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 bg-[#FFC400] hover:bg-[#efb900] text-[#071F50] font-bold px-8 rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-[#0759D6] focus-visible:outline-offset-3 motion-reduce:transition-none"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Contact Details Cards */}
          <div className="min-w-0 space-y-6">
            
            {/* Info details card */}
            <div className="bg-white p-6 rounded-3xl border border-[#c7def5] shadow-[0_8px_24px_-16px_#082b6333] space-y-6">
              <h3 className="font-extrabold text-sm text-[#082B68] uppercase tracking-wider border-b border-[#dceaff] pb-3">
                Support Desk & Offices
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2.5 bg-[#EAF5FF] rounded-full border border-[#dceaff] text-[#0759D6] mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#082B68]">Customer Desk</h4>
                    <p className="text-[#526681] font-medium pt-0.5 leading-relaxed wrap-anywhere">VenterShop Headquarters & Logistics Center, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-[#dceaff] pt-4">
                  <div className="shrink-0 p-2.5 bg-[#EAF5FF] rounded-full border border-[#dceaff] text-[#0759D6] mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#082B68]">Phone Hotline</h4>
                    <p className="text-[#526681] font-medium pt-0.5 leading-relaxed wrap-anywhere">+94 77 123 4567 / +1 (800) 555-0199</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-[#dceaff] pt-4">
                  <div className="shrink-0 p-2.5 bg-[#EAF5FF] rounded-full border border-[#dceaff] text-[#0759D6] mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#082B68]">Support Email</h4>
                    <p className="text-[#526681] font-medium pt-0.5 leading-relaxed wrap-anywhere"><a href="mailto:support@ventershop.com" className="rounded-sm hover:text-[#0759D6] focus-visible:outline-2 focus-visible:outline-[#0759D6]">support@ventershop.com</a> / <a href="mailto:export@ventershop.com" className="rounded-sm hover:text-[#0759D6] focus-visible:outline-2 focus-visible:outline-[#0759D6]">export@ventershop.com</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Maps Card */}
            <div className="bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] text-white p-6 rounded-3xl border border-[#4d80cc]/30 shadow-[0_8px_24px_-16px_#082b6333] relative overflow-hidden h-40 flex items-center justify-center">
              <Globe aria-hidden="true" strokeWidth={.7} className="absolute -right-5 -top-10 h-56 w-56 text-[#82b8ff]/20" />
              <div className="relative text-center z-10 space-y-2">
                <span className="inline-block bg-[#FFC400] text-[#071F50] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Global Logistics Center
                </span>
                <p className="text-xs font-bold text-[#dceaff]">Sri Lanka & International Logistics</p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
