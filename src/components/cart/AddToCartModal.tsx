'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, X, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export interface IAddedItemNotification {
  productId: string;
  quantity: number;
  variantName?: string;
  selectedPrice?: number;
  productName?: string;
  productImage?: string;
}

interface AddToCartModalProps {
  item: IAddedItemNotification | null;
  onClose: () => void;
  cartCount: number;
}

export default function AddToCartModal({ item, onClose, cartCount }: AddToCartModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (item) {
      setVisible(true);
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [item]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  if (!item && !visible) return null;

  const defaultImage =
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] max-w-sm w-[calc(100vw-2rem)] transition-all duration-300 ease-out transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-[#021838] border-2 border-[#0052CC] rounded-3xl p-4 shadow-2xl text-white backdrop-blur-xl relative overflow-hidden ring-4 ring-[#0052CC]/20">
        {/* Animated Accent Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-[#FFB800] to-[#0052CC] animate-pulse" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#0052CC]/30 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Added to Cart!</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#01142F] border border-[#0052CC]/40 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item?.productImage || defaultImage}
              alt={item?.productName || 'Product'}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.currentTarget.src = defaultImage;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-white truncate leading-tight">
              {item?.productName || 'Product Item'}
            </h4>

            {item?.variantName && (
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-[10px] font-black uppercase">
                {item.variantName}
              </span>
            )}

            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-blue-200/80 font-medium">Qty: {item?.quantity || 1}</span>
              {item?.selectedPrice ? (
                <span className="font-mono font-black text-emerald-400">
                  {formatCurrency(item.selectedPrice * (item.quantity || 1))}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0052CC]/30">
          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-[#01142F] hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold transition-all text-center border border-blue-900/60 cursor-pointer"
          >
            Continue
          </button>

          <Link
            href="/cart"
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#003893] hover:from-[#FFB800] hover:to-amber-500 hover:text-[#021838] text-white text-[11px] font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Cart ({cartCount})</span>
          </Link>
        </div>

        {/* Auto dismiss countdown bar */}
        <div className="w-full bg-[#01142F] h-1 rounded-full overflow-hidden mt-3">
          <div className="bg-gradient-to-r from-[#0052CC] to-[#FFB800] h-full w-full origin-left animate-[shrink_4.5s_linear_forwards]" />
        </div>
      </div>
    </div>
  );
}
