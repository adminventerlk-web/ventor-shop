'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Briefcase,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Store,
  Ticket,
  Package,
  Megaphone,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IStatsMetrics {
  totalRevenue: number;
  overallRevenue?: number;
  filteredOrderCount?: number;
  activeOrders: number;
  totalCustomers: number;
  pendingWholesale: number;
  selectedMonth?: string;
}

interface IMonthlyBreakdown {
  key: string;
  label: string;
  year: number;
  month: number;
  totalRevenue: number;
  orderCount: number;
}

interface ILowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
}

interface IRecentOrder {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

interface IRecentB2BApp {
  _id: string;
  businessName: string;
  contactPerson: string;
  status: string;
  expectedOrderVolume: string;
}

export default function AdminOverviewDashboard() {
  const [metrics, setMetrics] = useState<IStatsMetrics | null>(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<IMonthlyBreakdown[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [lowStock, setLowStock] = useState<ILowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<IRecentOrder[]>([]);
  const [recentB2B, setRecentB2B] = useState<IRecentB2BApp[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin dashboard info when selectedMonth changes
  useEffect(() => {
    async function loadStats() {
      try {
        const query = selectedMonth ? `?month=${selectedMonth}` : '';
        const res = await fetch(`/api/admin/stats${query}`);
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setMonthlyBreakdown(data.monthlyBreakdown || []);
          setLowStock(data.lowStockAlerts || []);
          setRecentOrders(data.recentOrders || []);
          setRecentB2B(data.recentB2BApplications || []);
        }
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [selectedMonth]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'CANCELLED':
        return 'text-red-700 bg-red-50 border-red-100';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'text-sky-700 bg-sky-50 border-sky-100';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-24 border border-gray-150 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl h-96 border border-gray-150 animate-pulse" />
          <div className="bg-white rounded-xl h-96 border border-gray-150 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Monthly Revenue Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#101A2D] tracking-tight uppercase flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#E53935]" />
            Operations Overview
          </h1>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Back-Office Statistics and Administration Console
          </p>
        </div>

        {/* Monthly Wise Revenue Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2">Filter Revenue:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-50 border border-gray-250 font-extrabold text-xs text-[#101A2D] rounded-lg py-1.5 px-3 outline-none cursor-pointer focus:border-[#1A2A4A]"
          >
            <option value="ALL">All Time Revenue</option>
            {monthlyBreakdown.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({formatCurrency(m.totalRevenue)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── PRIORITY MANAGEMENT HUB (Top Operations) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
            High Priority Operations & Quick Management
          </h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Immediate Focus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Shop Approvals */}
          <Link
            href="/admin/shops"
            className="group bg-gradient-to-br from-[#021838] to-[#010e24] text-white p-4 rounded-2xl border border-[#0052CC]/40 hover:border-[#FFB800] transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-[#FFB800]/15 border border-[#FFB800]/30 rounded-xl text-[#FFB800]">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#FFB800] text-[#021838] px-2 py-0.5 rounded-full">
                Verify
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm text-white group-hover:text-[#FFB800] transition-colors">
                Shop Approvals
              </h3>
              <p className="text-[11px] text-blue-200/70 mt-0.5 line-clamp-1">
                Verify vendor applications & activate storefronts
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-[#FFB800]">
              <span>Manage Shops</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Student Vouchers & Offers */}
          <Link
            href="/admin/vouchers"
            className="group bg-gradient-to-br from-[#2a0845] to-[#16002c] text-white p-4 rounded-2xl border border-purple-500/40 hover:border-purple-400 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-purple-400 text-[#16002c] px-2 py-0.5 rounded-full">
                Vouchers
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm text-white group-hover:text-purple-300 transition-colors">
                Student Vouchers
              </h3>
              <p className="text-[11px] text-purple-200/70 mt-0.5 line-clamp-1">
                Approve V2CC percentage & amount voucher codes
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-purple-300">
              <span>Review Requests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="group bg-gradient-to-br from-[#06302b] to-[#011a17] text-white p-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-400 text-[#011a17] px-2 py-0.5 rounded-full">
                {metrics?.activeOrders ?? 0} Active
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                Store Orders
              </h3>
              <p className="text-[11px] text-emerald-200/70 mt-0.5 line-clamp-1">
                Track shipments, confirm dispatches & invoices
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-emerald-300">
              <span>Process Orders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Products & Inventory */}
          <Link
            href="/admin/products"
            className="group bg-gradient-to-br from-[#102a45] to-[#041324] text-white p-4 rounded-2xl border border-sky-500/40 hover:border-sky-400 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-sky-500/20 border border-sky-400/30 rounded-xl text-sky-300">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-sky-400 text-[#041324] px-2 py-0.5 rounded-full">
                Catalog
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm text-white group-hover:text-sky-300 transition-colors">
                Products & Variants
              </h3>
              <p className="text-[11px] text-sky-200/70 mt-0.5 line-clamp-1">
                Configure prices, sizes, stock levels & Ceylon items
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-sky-300">
              <span>Manage Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Quick Operations Links Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Quick Actions:</span>
          <Link
            href="/admin/ads"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0052CC] rounded-lg text-xs font-bold text-gray-700 hover:text-[#0052CC] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Storefront Ads</span>
          </Link>
          <Link
            href="/admin/communities"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0052CC] rounded-lg text-xs font-bold text-gray-700 hover:text-[#0052CC] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>V2CC-PMS Members</span>
          </Link>
          <Link
            href="/admin/categories"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0052CC] rounded-lg text-xs font-bold text-gray-700 hover:text-[#0052CC] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/featured"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0052CC] rounded-lg text-xs font-bold text-gray-700 hover:text-[#0052CC] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Items</span>
          </Link>
          <Link
            href="/admin/customers"
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0052CC] rounded-lg text-xs font-bold text-gray-700 hover:text-[#0052CC] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-red-500" />
            <span>B2B Wholesale</span>
          </Link>
        </div>
      </div>

      {/* High Priority Operations & Quick Actions Hub */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#101A2D] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E53935]" />
            High Priority Management
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href="/admin/ads"
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase text-[#101A2D] flex items-center gap-1 transition-colors"
            >
              <Megaphone className="w-3 h-3 text-[#FFB800]" />
              <span>Ads</span>
            </Link>
            <Link
              href="/admin/communities"
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase text-[#101A2D] flex items-center gap-1 transition-colors"
            >
              <Users className="w-3 h-3 text-sky-600" />
              <span>V2CC-PMS</span>
            </Link>
            <Link
              href="/admin/categories"
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase text-[#101A2D] flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3 h-3 text-indigo-600" />
              <span>Categories</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/shops"
            className="group bg-gradient-to-br from-[#021838] to-[#003893] text-white p-4 rounded-xl border border-[#0052CC]/40 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-white/10 text-[#FFB800] rounded-xl shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider truncate">Shop Approvals</p>
                <p className="text-[11px] text-blue-200/80 font-medium truncate">Verify vendor stores</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FFB800] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/vouchers"
            className="group bg-white p-4 rounded-xl border border-purple-200 hover:border-purple-400 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-[#101A2D] truncate">Student Vouchers</p>
                <p className="text-[11px] text-gray-500 font-medium truncate">Approve & issue codes</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/orders"
            className="group bg-white p-4 rounded-xl border border-emerald-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-[#101A2D] truncate">Orders Hub</p>
                <p className="text-[11px] text-gray-500 font-medium truncate">Fulfill & dispatch</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/products"
            className="group bg-white p-4 rounded-xl border border-blue-200 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-[#101A2D] truncate">Products & Stock</p>
                <p className="text-[11px] text-gray-500 font-medium truncate">Catalog & variants</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats KPI Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Revenue */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                {selectedMonth === 'ALL' ? 'Total Sales Revenue' : `Revenue (${selectedMonth})`}
              </p>
              <h4 className="text-lg sm:text-xl font-black text-[#101A2D] truncate">{formatCurrency(metrics.totalRevenue)}</h4>
              {selectedMonth !== 'ALL' && metrics.overallRevenue !== undefined && (
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  Overall: {formatCurrency(metrics.overallRevenue)}
                </p>
              )}
            </div>
          </div>

          {/* Active Orders */}
          <Link
            href="/admin/orders"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#1A2A4A]/20 transition-colors"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Open Orders</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.activeOrders}</h4>
            </div>
          </Link>

          {/* Customers */}
          <Link
            href="/admin/customers"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#1A2A4A]/20 transition-colors"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered Clients</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.totalCustomers}</h4>
            </div>
          </Link>

          {/* Pending B2B Apps */}
          <Link
            href="/admin/customers"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#E53935]/25 transition-colors"
          >
            <div className="p-3 bg-red-50 text-[#E53935] rounded-lg border border-red-100 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">B2B Applications</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.pendingWholesale}</h4>
            </div>
          </Link>
        </div>
      )}

      {/* Monthly Revenue Breakdown Card */}
      {monthlyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Monthly Revenue Performance Breakdown
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              Click month to filter
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {monthlyBreakdown.map((m) => {
              const isSelected = selectedMonth === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setSelectedMonth(isSelected ? 'ALL' : m.key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A2A4A] text-white border-[#1A2A4A] shadow-md ring-2 ring-[#1A2A4A]/20'
                      : 'bg-gray-50/70 hover:bg-gray-100 border-gray-200 text-[#101A2D]'
                  }`}
                >
                  <p className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    {m.label}
                  </p>
                  <h5 className="text-sm font-black mt-1">
                    {formatCurrency(m.totalRevenue)}
                  </h5>
                  <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    {m.orderCount} {m.orderCount === 1 ? 'Order' : 'Orders'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Low Stock & B2B Apps */}
        <div className="space-y-8">
          {/* Low Stock Alerts Card */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Low Stock Inventory Alerts
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>Manage Stock</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                All product stock balances remain above triggers.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStock.map((prod) => (
                  <div key={prod._id} className="p-4 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="text-[#101A2D] font-bold">{prod.name}</p>
                      <p className="text-[10px] text-gray-400">SKU: {prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-red-50 text-[#E53935] border border-red-100 font-extrabold px-2.5 py-0.5 rounded-sm">
                        Stock: {prod.stock} / Trigger: {prod.lowStockThreshold}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B2B Wholesale Applications */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                Pending B2B Applications
              </h3>
              <Link
                href="/admin/customers"
                className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>Approve Wholesale</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentB2B.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 font-semibold">
                No wholesale applications currently submitted.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentB2B.map((app) => (
                  <div key={app._id} className="p-4 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="text-[#101A2D] font-bold">{app.businessName}</p>
                      <p className="text-[10px] text-gray-400">Contact: {app.contactPerson} • Vol: {app.expectedOrderVolume}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${
                        app.status === 'PENDING' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              Recent Operations Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
            >
              <span>See All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 font-semibold">
              No orders registered in the system yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-4 flex justify-between items-center text-xs font-semibold hover:bg-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[#1A2A4A] font-bold">{order.orderNumber}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#101A2D] font-bold">{formatCurrency(order.total)}</span>
                    <span className={`inline-block px-2 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
