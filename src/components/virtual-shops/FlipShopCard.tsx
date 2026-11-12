'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCw, type LucideIcon } from 'lucide-react';

interface ShopCardContent {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  badge: string;
  icon: LucideIcon;
  href: string;
  isAvailable: boolean;
  features: string[];
}

export default function FlipShopCard({ shop, isTa }: { shop: ShopCardContent; isTa: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const frontControl = useRef<HTMLButtonElement>(null);
  const backControl = useRef<HTMLButtonElement>(null);
  const Icon = shop.icon;

  const flipWithControl = (showBack: boolean) => {
    setFlipped(showBack);
    requestAnimationFrame(() => (showBack ? backControl : frontControl).current?.focus());
  };

  return (
    <article aria-label={shop.title} className="h-full min-w-0 [overflow-wrap:anywhere] [perspective:1100px]"
      onPointerEnter={event => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !event.currentTarget.contains(document.activeElement)) setFlipped(true);
      }}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setFlipped(false);
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && flipped) {
          event.preventDefault();
          flipWithControl(false);
        }
      }}>
      <div data-flip-state={flipped ? 'back' : 'front'} className={`grid h-full min-h-[410px] transition-transform duration-[600ms] ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}>
        <div id={`${shop.id}-front`} aria-hidden={flipped} inert={flipped}
          className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#c7def5] bg-white shadow-[0_8px_24px_-12px_#082b6333] [grid-area:1/1] [backface-visibility:hidden]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#EAF5FF]">
            {/* Preserve the existing remote shop assets. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shop.image} alt={shop.title} loading="lazy" width={600} height={450} className="h-full w-full object-cover" />
            <span className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold ${shop.isAvailable ? 'border-[#0755B8] bg-[#0755B8] text-white' : 'border-[#c7def5] bg-[#EAF5FF] text-[#082B63]'}`}>{shop.badge}</span>
            <span aria-hidden="true" className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-[#0755B8] text-white shadow-sm"><Icon className="h-5 w-5" /></span>
          </div>
          <div className="flex flex-1 flex-col items-center p-5 text-center">
            <h2 className="min-w-0 text-base font-bold leading-snug text-[#082B63]">{shop.title}</h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-[#64748b]">{shop.subtitle}</p>
            <div aria-hidden="true" className="my-4 h-0.5 w-8 rounded-full bg-[#FFC400]" />
            <button ref={frontControl} type="button" aria-expanded={flipped} aria-controls={`${shop.id}-back`} aria-label={`View details for ${shop.title}`}
              onClick={() => flipWithControl(true)}
              className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#c7def5] bg-[#EAF5FF] px-4 py-2 text-xs font-bold text-[#0755B8] transition-colors hover:bg-[#d9ecff] focus-visible:outline-3 focus-visible:outline-[#0755B8] focus-visible:outline-offset-3 motion-reduce:transition-none!">
              <RotateCw aria-hidden="true" className="h-4 w-4" /> View shop details
            </button>
          </div>
        </div>

        <div id={`${shop.id}-back`} aria-hidden={!flipped} inert={!flipped}
          className="flex min-w-0 flex-col rounded-3xl border border-[#c7def5] bg-[linear-gradient(135deg,#071F50_0%,#082B68_55%,#0759D6_100%)] p-5 shadow-[0_8px_24px_-12px_#082b6333] [grid-area:1/1] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="mb-4 flex items-start gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#FFC400]"><Icon className="h-5 w-5" /></span>
            <h2 className="min-w-0 text-base font-bold leading-snug text-white">{shop.title}</h2>
          </div>
          <p className="text-xs font-medium leading-[1.7] text-[#dceaff]">{shop.desc}</p>
          <ul className="my-4 space-y-2 border-t border-white/15 pt-4">
            {shop.features.map(feature => <li key={feature} className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-white"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFC400]" /><span>{feature}</span></li>)}
          </ul>
          <div className="mt-auto space-y-2">
            {shop.isAvailable ? (
              <Link href={shop.href} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#071F50] transition-colors hover:bg-[#efb900] focus-visible:outline-3 focus-visible:outline-[#FFC400] focus-visible:outline-offset-3 motion-reduce:transition-none!">
                <span>{isTa ? 'இப்போதே வாங்கு' : 'Shop Now'}</span><ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : (
              <button type="button" disabled className="flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-[#dceaff]">
                <span>{isTa ? 'விரைவில்' : 'Coming Soon'}</span><ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
            <button ref={backControl} type="button" onClick={() => flipWithControl(false)} aria-label={`Back to image for ${shop.title}`}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-[#FFC400] focus-visible:outline-offset-3 motion-reduce:transition-none!">
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> Back to shop image
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
