'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Store,
  Plus,
  ExternalLink,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function VendorDashboardOverview() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch('/api/vendor/products'),
          fetch('/api/vendor/orders'),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } catch (err) {
        console.error('Failed to load vendor overview data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.vendorTotal || 0), 0);
  const shopSlug = user?.shopSlug || 'store';
  const shopName = user?.shopName || 'My Vendor Shop';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#010e24] text-white overflow-x-hidden">
      <VendorSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#021838] via-[#032352] to-[#0052CC]/40 border border-[#0052CC]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#0052CC]/30 border border-[#0052CC] text-[#FFB800]">
                  <Store className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Super Admin Approved
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {shopName}!
              </h1>
              <p className="text-xs text-blue-200/80 max-w-2xl">
                Your store is live on the VENTERPRISE home page and marketplace. Manage your products, variants, and customer orders directly below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/shops/${shopSlug}`}
                target="_blank"
                className="px-4 py-2.5 bg-[#01142F] hover:bg-white/10 border border-blue-700/60 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-[#FFB800]" />
                <span>View Live Shop</span>
              </Link>
              <Link
                href="/vendor/products?new=true"
                className="px-4 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Products Listed
              </span>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mt-2">
              {loading ? '...' : products.length}
            </p>
            <Link
              href="/vendor/products"
              className="text-[11px] font-bold text-blue-300 hover:text-white mt-2 flex items-center gap-1"
            >
              <span>Manage products & variants</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                Orders Received
              </span>
              <ShoppingBag className="w-5 h-5 text-[#FFB800]" />
            </div>
            <p className="text-3xl font-black text-[#FFB800] mt-2">
              {loading ? '...' : orders.length}
            </p>
            <Link
              href="/vendor/orders"
              className="text-[11px] font-bold text-[#FFB800] hover:underline mt-2 flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Total Shop Sales
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {loading ? '...' : formatCurrency(totalRevenue)}
            </p>
            <span className="text-[10px] text-emerald-300/80 mt-1 block">
              Direct orders processed for your items
            </span>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-[#021838] border border-[#0052CC]/30 rounded-3xl p-6 shadow-md mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-blue-900/40 mb-4">
            <div>
              <h2 className="text-base font-black text-white">Recent Customer Orders</h2>
              <p className="text-xs text-blue-200/70">
                Incoming orders containing your shop's products. You also receive real-time email & message alerts.
              </p>
            </div>
            <Link
              href="/vendor/orders"
              className="text-xs font-bold text-[#FFB800] hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-10 h-10 text-blue-400/30 mx-auto mb-2" />
              <p className="text-xs font-bold text-blue-200/60">No orders received yet.</p>
              <p className="text-[11px] text-blue-300/40 mt-1">
                When customers purchase your items, their order details will appear right here and be sent to your email.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blue-900/40 text-blue-300 uppercase text-[10px] font-black">
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Items & Variants</th>
                    <th className="py-2.5 px-3 text-right">Shop Total</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/30">
                  {orders.slice(0, 5).map((ord) => {
                    const cleanPhone = ord.customerPhone?.replace(/[^0-9]/g, '');
                    const whatsappText = encodeURIComponent(
                      `Hello ${ord.customerName}, regarding your order #${ord.orderNumber} on Venterprise from ${shopName}. We are preparing your order!`
                    );
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

                    return (
                      <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-white">
                          #{ord.orderNumber}
                          <span className="block text-[10px] text-gray-400 font-sans">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-white block">{ord.customerName}</strong>
                          <span className="text-[11px] text-blue-300">{ord.customerPhone}</span>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          {ord.items?.map((it: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-blue-100">
                              <span>• {it.name} (x{it.quantity})</span>
                              {it.variantName && (
                                <span className="ml-1 text-[10px] text-[#FFB800] font-bold">
                                  [{it.variantName}]
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-emerald-400">
                          {formatCurrency(ord.vendorTotal || 0)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {ord.orderStatus || 'CONFIRMED'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {cleanPhone ? (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500 text-emerald-200 hover:text-white rounded-lg text-[11px] font-bold transition-all"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          ) : (
                            <span className="text-gray-500 text-[10px]">No phone</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

