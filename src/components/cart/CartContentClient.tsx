'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Percent,
  Truck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface ICalculationItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedOfferName?: string;
}

interface ICalculationResult {
  items: ICalculationItem[];
  subtotal: number;
  itemDiscounts: number;
  voucherDiscount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number;
  appliedVoucher: { code: string; discountAmount: number } | null;
  voucherError: string | null;
}

export default function CartContentClient() {
  const { cart, updateQuantity, removeFromCart, appliedVoucherCode, setAppliedVoucherCode } = useCart();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  const [calcResult, setCalcResult] = useState<ICalculationResult | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [voucherErrorMsg, setVoucherErrorMsg] = useState<string | null>(null);

  // Sync input value with active voucher code
  useEffect(() => {
    if (appliedVoucherCode) {
      setVoucherInput(appliedVoucherCode);
    }
  }, [appliedVoucherCode]);

  // 1. Core Calculator fetch caller
  const calculateCartTotals = useCallback(async () => {
    if (cart.length === 0) {
      setCalcResult(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          voucherCode: appliedVoucherCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
        
        // Auto-purge stale or deleted items from cart state
        if (data.items) {
          const returnedValidIds = new Set(data.items.map((i: any) => i.productId));
          const staleItems = cart.filter((ci) => !returnedValidIds.has(ci.productId));
          if (staleItems.length > 0) {
            staleItems.forEach((stale) => removeFromCart(stale.productId));
          }
        }

        if (data.voucherError) {
          setVoucherErrorMsg(data.voucherError);
        } else {
          setVoucherErrorMsg(null);
        }
      }
    } catch (e) {
      console.error('Error calculating cart:', e);
    } finally {
      setLoading(false);
    }
  }, [cart, appliedVoucherCode, removeFromCart]);

  useEffect(() => {
    calculateCartTotals();
  }, [calculateCartTotals]);

  // 2. Handle Apply Voucher action
  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    if (!user) {
      setVoucherErrorMsg('Please register or log in to apply this voucher code.');
      return;
    }

    setApplyingVoucher(true);
    setVoucherErrorMsg(null);

    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          voucherCode: voucherInput.trim().toUpperCase(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
        if (data.voucherError) {
          setVoucherErrorMsg(data.voucherError);
          setAppliedVoucherCode(null);
        } else {
          setAppliedVoucherCode(voucherInput.trim().toUpperCase());
          setVoucherErrorMsg(null);
        }
      }
    } catch (error) {
      setVoucherErrorMsg('Failed to apply voucher code. Please try again.');
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode(null);
    setVoucherInput('');
    setVoucherErrorMsg(null);
  };

  // Instant Optimistic Quantity Adjuster (0ms response)
  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    // 1. INSTANT OPTIMISTIC UI UPDATE
    setCalcResult((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items.map((i) => {
        if (i.productId === productId) {
          const updatedSubtotal = Math.round(i.finalPrice * newQty * 100) / 100;
          return {
            ...i,
            quantity: newQty,
            subtotal: updatedSubtotal,
            total: updatedSubtotal,
          };
        }
        return i;
      });

      const newSubtotal = Math.round(
        updatedItems.reduce((acc, curr) => acc + curr.total, 0) * 100
      ) / 100;
      const newCartTotalAfterDiscount = Math.max(0, newSubtotal - prev.itemDiscounts - prev.voucherDiscount);
      const newDeliveryFee = newCartTotalAfterDiscount >= prev.freeDeliveryThreshold ? 0 : (prev.deliveryFee || 12.5);
      const newTotal = Math.round((newCartTotalAfterDiscount + newDeliveryFee) * 100) / 100;

      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        deliveryFee: newDeliveryFee,
        total: newTotal,
      };
    });

    // 2. Sync React Context & Local Storage
    updateQuantity(productId, newQty);
  };

  const cartBanner = (
    <section aria-labelledby="cart-heading" data-cart-hero className="relative isolate mb-8 flex flex-col justify-center gap-5 overflow-hidden rounded-[36px] border border-[#4d80cc]/30 bg-linear-to-br from-[#071F50] via-[#082B68] to-[#0759D6] px-6 py-8 text-white shadow-[0_16px_40px_-22px_#071f5070] sm:px-9 lg:h-[180px] lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-6">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -right-20 -z-10 h-[420px] w-[540px] -rotate-12 rounded-[50%] border border-white/10 bg-linear-to-br from-[#247bec]/30 to-[#0759D6]/5" />
      <div className="min-w-0 space-y-2">
        <h1 id="cart-heading" className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t('cartTitle')}</h1>
        <p className="text-xs font-medium text-[#dceaff]"><span className="font-bold text-[#FFC400]">{calcResult?.items.length ?? cart.length}</span> {(calcResult?.items.length ?? cart.length) === 1 ? 'item' : 'items'} in your cart</p>
      </div>
      <Link href="/shop" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-white/35 bg-white/10 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-white/20 lg:self-auto"><ArrowRight aria-hidden="true" className="h-4 w-4 rotate-180" />Continue Shopping</Link>
    </section>
  );

  // 3. Render Empty Cart State
  if (!loading && (!calcResult || calcResult.items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-semibold">
        {cartBanner}
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#c7def5] bg-white px-6 py-12 text-center shadow-sm space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 mx-auto text-[#0759D6]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#082B68]">
            {language === 'ta' ? 'உங்கள் கார்ட் காலியாக உள்ளது' : 'Your Shopping Cart is Empty'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526681] max-w-md mx-auto font-medium">
            {language === 'ta'
              ? 'உங்கள் கூடையில் பொருட்கள் எதுவும் இல்லை. புதிய தயாரிப்புகளை வாங்க ஷாப்பிங் தொடங்குங்கள்.'
              : 'You have no items in your shopping cart. Discover our fresh groceries and quality products.'}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFC400] hover:bg-[#efb900] text-[#071F50] font-bold text-xs rounded-full shadow-sm transition-colors"
        >
          <span>{language === 'ta' ? 'ஷாப்பிங் தொடரவும்' : 'Continue Shopping'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      </div>
    );
  }

  // 4. Loading state
  if (loading || !calcResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {cartBanner}
        <div role="status" className="rounded-3xl border border-[#c7def5] bg-white py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#0759D6] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#526681] font-bold">Calculating cart totals...</p>
        </div>
      </div>
    );
  }

  const isFreeDelivery = calcResult.deliveryFee === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-semibold">
      
      {cartBanner}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {calcResult.items.map((item) => {
            const hasDiscount = item.basePrice > item.finalPrice;
            return (
              <div
                key={item.productId}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c7def5] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-sm"
              >
                {/* Product Image & Info */}
                <div className="flex min-w-0 items-center gap-4 flex-1">
                  <div
                    className="w-20 h-20 bg-cover bg-center rounded-lg border border-gray-150 shrink-0 bg-gray-50"
                    style={{ backgroundImage: `url('${item.image || '/images/hero_banner.png'}')` }}
                  />
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-[#082B68] wrap-anywhere">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-[#0759D6]">
                        {formatCurrency(item.finalPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {formatCurrency(item.basePrice)}
                        </span>
                      )}
                    </div>
                    {item.appliedOfferName && (
                      <span className="bg-blue-50 text-[#0759D6] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#c7def5] uppercase tracking-wide inline-flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.appliedOfferName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center border border-[#c7def5] rounded-xl bg-[#EAF5FF] h-10 w-32 select-none shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-[#082B68] hover:bg-[#dceaff] rounded-lg hover:text-[#0759D6] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="flex-grow text-center text-xs font-black text-[#082B68]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-[#082B68] hover:bg-[#dceaff] rounded-lg hover:text-[#0759D6] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Delete button */}
                <div className="flex items-center justify-between xl:justify-end gap-4 w-full xl:w-auto">
                  <span className="text-sm font-black text-[#082B68] xl:w-24 text-right">
                    {formatCurrency(item.total)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Totals Summary Panel */}
        <div className="space-y-5">
          
          {/* 1. Clear Delivery Notice */}
          <div className={`p-4 rounded-2xl border shadow-sm flex items-center gap-3 ${
            isFreeDelivery
              ? 'bg-[#EAF5FF] border-[#93bdf0] text-[#082B68]'
              : 'bg-white border-[#c7def5] text-[#082B68]'
          }`}>
            <Truck className="w-5 h-5 shrink-0 text-[#0759D6]" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold">
                {isFreeDelivery ? 'Free Delivery Applied' : `Standard Delivery (${formatCurrency(calcResult.deliveryFee)})`}
              </p>
              <p className="text-[10px] font-medium opacity-90">
                {isFreeDelivery
                  ? `Orders over ${formatCurrency(calcResult.freeDeliveryThreshold || 7500)} receive Free Delivery across Sri Lanka.`
                  : `Orders over ${formatCurrency(calcResult.freeDeliveryThreshold || 7500)} receive Free Delivery.`}
              </p>
            </div>
          </div>

          {/* 2. Totals box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c7def5] shadow-sm space-y-5">
            <h3 className="font-bold text-xs text-[#082B68] uppercase tracking-wider border-b border-[#dceaff] pb-3">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#526681] font-medium">
                <span>{t('cartSubtotal')}</span>
                <span className="font-bold text-[#082B68]">{formatCurrency(calcResult.subtotal)}</span>
              </div>
              
              {calcResult.itemDiscounts > 0 && (
                <div className="flex justify-between text-[#0759D6] font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Offers Discount
                  </span>
                  <span>-{formatCurrency(calcResult.itemDiscounts)}</span>
                </div>
              )}

              {calcResult.voucherDiscount > 0 && (
                <div className="flex justify-between text-[#0759D6] font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Voucher Discount
                  </span>
                  <span>-{formatCurrency(calcResult.voucherDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#526681] font-medium">
                <span>Delivery Fee</span>
                <span className="font-bold">
                  {isFreeDelivery ? (
                    <span className="text-[#0759D6] font-bold">FREE</span>
                  ) : (
                    formatCurrency(calcResult.deliveryFee)
                  )}
                </span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-4 border-t border-[#dceaff]">
                <span className="text-sm font-black text-[#082B68]">{t('cartTotal')}</span>
                <span className="text-2xl font-serif font-black text-[#0759D6]">
                  {formatCurrency(calcResult.total)}
                </span>
              </div>
            </div>

            {/* Voucher apply box */}
            <div className="border-t border-[#dceaff] pt-4 space-y-2.5">
              <h4 className="text-xs font-bold text-[#082B68]">{t('cartApplyVoucher')}</h4>
              
              {calcResult.appliedVoucher ? (
                <div className="bg-blue-50 text-[#082B68] border border-[#c7def5] rounded-lg p-2.5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black">
                      CODE: {calcResult.appliedVoucher.code}
                    </p>
                    <p className="text-[10px] text-[#0759D6] font-medium">
                      Saved {formatCurrency(calcResult.appliedVoucher.discountAmount)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                  >
                    {t('cartRemoveVoucher')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code (e.g. WELCOME10)"
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value.toUpperCase());
                      setVoucherErrorMsg(null);
                    }}
                    className="min-w-0 flex-1 px-3 py-2.5 bg-[#f2f8ff] border border-[#c7def5] rounded-lg text-xs outline-none focus:bg-white focus:border-[#0759D6] text-[#082B68] font-bold uppercase tracking-wider"
                    disabled={applyingVoucher}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#071F50] hover:bg-[#082B68] text-white text-xs font-bold rounded-lg transition-colors disabled:bg-gray-400 cursor-pointer"
                    disabled={applyingVoucher || !voucherInput.trim()}
                  >
                    {applyingVoucher ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Voucher error feedback */}
              {voucherErrorMsg && (
                <p className="text-[10px] text-red-600 font-bold bg-red-50 p-2 rounded-md border border-red-100">
                  ⚠️ {voucherErrorMsg}
                </p>
              )}
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full h-11 flex items-center justify-center gap-2 bg-[#FFC400] hover:bg-[#efb900] text-[#071F50] font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <span>{t('cartCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
