'use client';

import React, { useState, useEffect } from 'react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ShoppingBag,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/vendor/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const shopName = user?.shopName || 'My Vendor Shop';

  return (
    <div className="flex min-h-screen bg-[#010e24] text-white">
      <VendorSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0052CC]/30 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#0052CC]/20 border border-[#0052CC] text-[#FFB800] rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Orders for {shopName}
              </h1>
            </div>
            <p className="text-xs text-blue-200/70 mt-1">
              Real-time customer orders containing your items. Automatic order emails are sent to your inbox upon placement.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-[#021A3E] hover:bg-[#0052CC] border border-[#0052CC]/40 rounded-xl text-xs font-bold transition-all text-blue-100 hover:text-white cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Live Notification Indicator Banner */}
        <div className="mb-6 p-4 bg-[#0052CC]/15 border border-[#0052CC]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0052CC]/30 text-[#FFB800]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">
                Automated Email & Message Dispatching Active
              </h3>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Whenever a shopper orders products from your store, the details are sent directly to your registered email ({user?.email}) and logged in this dashboard.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-blue-200/70">Loading store orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-blue-400/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No store orders yet</h3>
            <p className="text-xs text-blue-200/70 max-w-sm mx-auto mt-1">
              As soon as customers checkout with products from {shopName}, their delivery details, item variants, and phone numbers will be listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cleanPhone = order.customerPhone?.replace(/[^0-9]/g, '');
              const itemsSummary = order.items
                ?.map((it: any) => `${it.name}${it.variantName ? ` (${it.variantName})` : ''} x${it.quantity}`)
                .join(', ');
              const whatsappMsg = encodeURIComponent(
                `Hello ${order.customerName}! This is ${shopName}. We have received your order #${order.orderNumber} for: ${itemsSummary}. We are packaging it for delivery to ${order.deliveryAddress?.city || 'your address'}. Thank you!`
              );
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

              return (
                <div
                  key={order._id}
                  className="bg-[#021838] border border-[#0052CC]/30 hover:border-[#0052CC]/70 rounded-2xl p-5 sm:p-6 transition-all shadow-md space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/50">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-white">
                        Order #{order.orderNumber}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <label htmlFor={`status-${order._id}`} className="text-[10px] uppercase font-bold text-blue-300">Status:</label>
                        <select
                          id={`status-${order._id}`}
                          value={order.orderStatus || 'CONFIRMED'}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#01142F] border border-[#0052CC]/60 text-[#FFB800] focus:outline-none focus:border-[#FFB800] cursor-pointer transition-colors"
                        >
                          <option value="PENDING" className="bg-[#021838] text-yellow-300">PENDING</option>
                          <option value="CONFIRMED" className="bg-[#021838] text-blue-300">CONFIRMED</option>
                          <option value="PROCESSING" className="bg-[#021838] text-purple-300">PROCESSING</option>
                          <option value="SHIPPED" className="bg-[#021838] text-cyan-300">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY" className="bg-[#021838] text-orange-300">OUT FOR DELIVERY</option>
                          <option value="DELIVERED" className="bg-[#021838] text-emerald-300">DELIVERED</option>
                          <option value="CANCELLED" className="bg-[#021838] text-rose-300">CANCELLED</option>
                        </select>
                        {updatingId === order._id && (
                          <RefreshCw className="w-3 h-3 text-[#FFB800] animate-spin" />
                        )}
                      </div>

                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cleanPhone && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      )}
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="p-1.5 bg-[#01142F] hover:bg-blue-800 border border-blue-800 text-blue-200 hover:text-white rounded-xl transition-all"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#01142F]/60 rounded-xl p-3.5 border border-blue-900/40">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-300 block">
                        Customer Contact
                      </span>
                      <p className="font-bold text-white text-sm">{order.customerName}</p>
                      <p className="text-blue-200">Phone: {order.customerPhone || 'Not provided'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-300 block">
                        Delivery Destination
                      </span>
                      <p className="text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {order.deliveryAddress?.addressLine1}, {order.deliveryAddress?.city}
                        {order.deliveryAddress?.postalCode ? ` (${order.deliveryAddress.postalCode})` : ''}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        Country: {order.deliveryAddress?.country || 'Sri Lanka'}
                      </p>
                    </div>
                  </div>

                  {/* Purchased Items Table */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-blue-300 block">
                      Products Ordered From {shopName}:
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-blue-900/40 text-gray-400 text-[10px] uppercase">
                            <th className="py-1.5">Product & Variant</th>
                            <th className="py-1.5 text-center">Quantity</th>
                            <th className="py-1.5 text-right">Unit Price</th>
                            <th className="py-1.5 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/20">
                          {order.items?.map((item: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-2 text-white">
                                <strong>{item.name}</strong>
                                {item.variantName && (
                                  <span className="ml-2 inline-block px-2 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-[10px] font-black">
                                    Variant: {item.variantName}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 text-center text-blue-100 font-bold">
                                {item.quantity}
                              </td>
                              <td className="py-2 text-right text-gray-300">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="py-2 text-right font-bold text-emerald-400">
                                {formatCurrency(item.total || item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total Bar */}
                  <div className="pt-2 border-t border-blue-900/50 flex justify-between items-center text-xs">
                    <span className="text-blue-300 font-semibold">
                      Notification sent to vendor email & message channel
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">
                        Store Items Total:
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        {formatCurrency(order.vendorTotal || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

