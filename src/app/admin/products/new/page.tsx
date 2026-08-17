'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
    sku: '',
    categoryId: '',
    brand: 'VASTRIKA',
    fabric: 'Pure Silk',
    occasion: 'Wedding',
    pattern: 'Zari Weave',
    gender: 'WOMEN',
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
  });

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  ]);

  const [variants, setVariants] = useState<any[]>([
    { size: 'Free Size', color: 'Royal Crimson', sku: '', price: '', stock: '10' },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleImageChange = (index: number, val: string) => {
    const copy = [...images];
    copy[index] = val;
    setImages(copy);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { size: 'S', color: 'Gold', sku: '', price: formData.price, stock: '10' },
    ]);
  };

  const handleVariantChange = (index: number, field: string, val: string) => {
    const copy = [...variants];
    copy[index][field] = val;
    setVariants(copy);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.price || !formData.categoryId || !formData.sku) {
        throw new Error('Please fill in all mandatory product information (Name, Price, Category, SKU).');
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: images.filter((img) => img.trim() !== ''),
          variants,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Add New Master Creation</h1>
          <p className="text-xs text-stone-500">
            Publish a handcrafted Indian ethnic product to the store catalog.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
            1. Core Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Product Title *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Royal Crimson Banarasi Katan Silk Saree"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">SKU Code *</label>
              <input
                type="text"
                name="sku"
                placeholder="e.g. SAR-BAN-009"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Short Tagline</label>
            <input
              type="text"
              name="shortDescription"
              placeholder="e.g. Pure Katan silk with gold zari floral kadwa weave."
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Description & Story</label>
            <textarea
              rows={4}
              name="description"
              placeholder="Describe the weave history, craftsmanship, and styling recommendations..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* Pricing & Attributes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
            2. Pricing & Attributes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="14999"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">MRP (₹) *</label>
              <input
                type="number"
                name="mrp"
                placeholder="19999"
                value={formData.mrp}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Discount %</label>
              <input
                type="number"
                name="discount"
                placeholder="25"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Fabric</label>
              <input
                type="text"
                name="fabric"
                placeholder="Pure Katan Silk"
                value={formData.fabric}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Occasion</label>
              <input
                type="text"
                name="occasion"
                placeholder="Wedding / Festive"
                value={formData.occasion}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Pattern</label>
              <input
                type="text"
                name="pattern"
                placeholder="Zari Weave"
                value={formData.pattern}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="WOMEN">Women</option>
                <option value="MEN">Men</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>
          </div>

          {/* Badges Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
              />
              <span>Mark as Featured</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleInputChange}
                className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
              />
              <span>Mark as Bestseller</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
              />
              <span>Mark as New Arrival</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-serif text-lg font-bold text-stone-900">3. Product Images</h3>
            <button
              type="button"
              onClick={handleAddImage}
              className="text-xs font-bold text-vastrika-maroon-900 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Image URL
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="https://..."
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  className="flex-1 text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="p-2 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              4. Sizes, Colors & Inventory
            </h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-xs font-bold text-vastrika-maroon-900 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 items-center">
                <div>
                  <label className="text-[10px] text-stone-500 font-semibold block">Size</label>
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                    placeholder="S, M, Free Size"
                    className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-semibold block">Color</label>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                    placeholder="Crimson"
                    className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-semibold block">Variant SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                    placeholder="Auto SKU"
                    className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-semibold block">Stock Units</label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                    placeholder="10"
                    className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg font-mono"
                    required
                  />
                </div>
                <div className="flex justify-end pt-3 sm:pt-0">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="p-1.5 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Publish Product</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
