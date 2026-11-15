'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import {
  Package,
  Plus,
  Trash2,
  Tag,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface IVariantInput {
  name: string;
  price: number | '';
  stock: number | '';
  image: string;
}

export default function VendorProductsPage() {
  const searchParams = useSearchParams();
  const shouldOpenNewModal = searchParams.get('new') === 'true';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('cat_groceries_01');
  const [retailPrice, setRetailPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(25);
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(['', '', '']);

  // Dynamic Variants (Sizes / Counts / Weights)
  const [variants, setVariants] = useState<IVariantInput[]>([
    { name: '250g', price: '', stock: 20, image: '' },
    { name: '500g', price: '', stock: 15, image: '' },
    { name: '1kg', price: '', stock: 10, image: '' },
  ]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (shouldOpenNewModal) {
      setModalOpen(true);
    }
  }, [shouldOpenNewModal]);

  const handleAddVariantRow = () => {
    setVariants((prev) => [...prev, { name: '', price: '', stock: 10, image: '' }]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof IVariantInput, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setCategoryId('cat_groceries_01');
    setRetailPrice('');
    setStock(25);
    setDescription('');
    setMainImage('');
    setGalleryImages(['', '', '']);
    setVariants([
      { name: '250g', price: '', stock: 20, image: '' },
      { name: '500g', price: '', stock: 15, image: '' },
      { name: '1kg', price: '', stock: 10, image: '' },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }
    if (!retailPrice || Number(retailPrice) <= 0) {
      setErrorMsg('Please enter a valid base price (LKR)');
      return;
    }

    setSubmitting(true);

    const allImages = [
      mainImage.trim() || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      ...galleryImages.map((img) => img.trim()).filter(Boolean),
    ];

    const validVariants = variants
      .filter((v) => v.name.trim() && v.price !== '')
      .map((v) => ({
        name: v.name.trim(),
        price: Number(v.price),
        stock: Number(v.stock || stock || 10),
        image: v.image.trim() || allImages[0],
      }));

    try {
      const res = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim() || undefined,
          categoryId,
          retailPrice: Number(retailPrice),
          stock: Number(stock || 10),
          description: description.trim() || name.trim(),
          images: allImages,
          variants: validVariants,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Product added successfully with variants!');
        resetForm();
        setModalOpen(false);
        await fetchProducts();
      } else {
        setErrorMsg(data.error || 'Failed to create product');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to add product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const res = await fetch(`/api/vendor/products?id=${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#010e24] text-white">
      <VendorSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0052CC]/30 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#0052CC]/20 border border-[#0052CC] text-[#FFB800] rounded-xl">
                <Package className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Store Products & Variants
              </h1>
            </div>
            <p className="text-xs text-blue-200/70 mt-1">
              Add products with multiple sizes, counts, weights, dynamic pricing, and individual variant images.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-[#021430] font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Feedback message */}
        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Products Grid / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-blue-200/70">Loading store products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#021838] border border-[#0052CC]/30 rounded-3xl p-12 text-center">
            <Package className="w-12 h-12 text-blue-400/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No products added yet</h3>
            <p className="text-xs text-blue-200/70 max-w-sm mx-auto mt-1 mb-5">
              Start adding your products with multiple sizes, pack counts, and prices so customers can order from your shop.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-[#0052CC] hover:bg-[#003893] text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const displayImg = product.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
              const variantsList = product.variants || [];

              return (
                <div
                  key={product._id}
                  className="bg-[#021838] border border-[#0052CC]/30 hover:border-[#0052CC] rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative h-44 w-full bg-gray-900 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105"
                        style={{ backgroundImage: `url('${displayImg}')` }}
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="bg-[#021838]/80 backdrop-blur-xs text-[#FFB800] border border-[#FFB800]/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-blue-300/80 font-bold uppercase">
                        <span>SKU: {product.sku}</span>
                        {variantsList.length > 0 && (
                          <span className="text-[#FFB800] bg-[#FFB800]/10 px-1.5 py-0.5 rounded">
                            {variantsList.length} Variations
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-white line-clamp-1">{product.name}</h3>

                      <p className="text-xs text-blue-200/70 line-clamp-2">
                        {product.description || product.shortDescription}
                      </p>

                      {/* Base Price */}
                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#FFB800]">
                          {formatCurrency(product.retailPrice)}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Base Price</span>
                      </div>

                      {/* Variants Preview Pills */}
                      {variantsList.length > 0 && (
                        <div className="pt-2 border-t border-blue-900/40">
                          <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                            Available Variants & Prices:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {variantsList.map((v: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 bg-[#01142F] border border-blue-800/80 px-2 py-0.5 rounded-md text-[10px] text-blue-100"
                              >
                                <strong className="text-white">{v.name}:</strong>
                                <span className="text-emerald-400 font-bold">{formatCurrency(v.price)}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-2 border-t border-blue-900/40 flex items-center justify-between bg-[#010e24]/40">
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View in Store</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-200 rounded-lg transition-colors cursor-pointer"
                      title="Remove Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ADD PRODUCT MODAL (WITH VARIANTS BUILDER) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#021838] border border-[#0052CC] rounded-3xl max-w-2xl w-full my-8 p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#FFB800]/20 text-[#FFB800]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Add New Store Product</h2>
                    <p className="text-xs text-blue-200/70">
                      Configure product information, base price, and custom size/count variations.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 text-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-100 block">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Ceylon Cinnamon Sticks (Alba Grade)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                  />
                </div>

                {/* Category & SKU */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-100 block">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-bold outline-none focus:border-[#FFB800] cursor-pointer"
                    >
                      <option value="cat_groceries_01">Fruits & Vegetables / Groceries</option>
                      <option value="cat_home_02">Kitchen & Cookware</option>
                      <option value="cat_books_03">Books & Stationery</option>
                      <option value="cat_clothing_04">Clothing & Fashion</option>
                      <option value="cat_electronics_05">Mobiles & Electronics</option>
                      <option value="cat_animal_feed_06">Pet Supplies & Animal Feed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-100 block">SKU / Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CIN-ALBA-01"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                {/* Base Retail Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-100 block">Base Price (LKR) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 1250"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-100 block">Available Stock *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="e.g. 50"
                      value={stock}
                      onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-100 block">
                    Product Images (Main image + up to 3 gallery photos)
                  </label>
                  <input
                    type="url"
                    placeholder="Main Image URL (e.g. https://...)"
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs font-medium placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((img, idx) => (
                      <input
                        key={idx}
                        type="url"
                        placeholder={`Gallery Image #${idx + 1}`}
                        value={img}
                        onChange={(e) => {
                          const updated = [...galleryImages];
                          updated[idx] = e.target.value;
                          setGalleryImages(updated);
                        }}
                        className="w-full px-3 py-2 bg-[#01142F] border border-blue-900 rounded-xl text-white text-xs font-medium placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-100 block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your product details, origin, quality, and usage..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#01142F] border border-blue-800 rounded-xl text-white text-xs placeholder-blue-300/30 outline-none focus:border-[#FFB800] resize-none"
                  />
                </div>

                {/* DYNAMIC PRODUCT VARIANTS SECTION */}
                <div className="bg-[#01142F] border border-blue-800/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#FFB800] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Product Variations (Sizes, Counts & Dynamic Prices)</span>
                      </h4>
                      <p className="text-[10px] text-blue-300/80">
                        When buyers click each variant on the website, the displayed price and image will dynamically update!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="px-2.5 py-1 bg-[#0052CC] hover:bg-[#003893] text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="bg-[#021838] border border-blue-900 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center relative"
                    >
                      <div>
                        <label className="text-[10px] font-bold text-blue-300 block mb-0.5">
                          Variant Name / Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 500g / 1kg / Pack of 6"
                          value={v.name}
                          onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#010e24] border border-blue-900 rounded-lg text-xs text-white font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-blue-300 block mb-0.5">
                          Variant Price (LKR)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 950"
                          value={v.price}
                          onChange={(e) =>
                            handleVariantChange(
                              idx,
                              'price',
                              e.target.value === '' ? '' : Number(e.target.value)
                            )
                          }
                          className="w-full px-2.5 py-1.5 bg-[#010e24] border border-blue-900 rounded-lg text-xs text-white font-bold placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-blue-300 block mb-0.5">
                          Variant Image (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={v.image}
                          onChange={(e) => handleVariantChange(idx, 'image', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#010e24] border border-blue-900 rounded-lg text-xs text-white placeholder-blue-300/30 outline-none focus:border-[#FFB800]"
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-4">
                        <span className="text-[10px] text-gray-400">#{idx + 1}</span>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(idx)}
                            className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded-lg cursor-pointer"
                            title="Remove Variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-900/50">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-bold text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] disabled:bg-gray-700 text-[#021430] font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    {submitting ? 'Publishing...' : 'Publish Product to Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

