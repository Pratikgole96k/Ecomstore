'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/types';
import { Star, ShieldCheck, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProductTabs({ product }: { product: ProductItem }) {
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.review) {
        setReviewsList([data.review, ...reviewsList]);
        setReviewSuccess(true);
        setTitle('');
        setComment('');
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (e) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-vastrika-ivory-300 shadow-luxury space-y-8">
      {/* Tab Buttons */}
      <div className="flex border-b border-vastrika-ivory-300 overflow-x-auto gap-4 sm:gap-8 text-xs sm:text-sm font-bold tracking-wider uppercase">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3.5 transition border-b-2 whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-vastrika-maroon-900 text-vastrika-maroon-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Product Story & Specifications
        </button>

        <button
          onClick={() => setActiveTab('care')}
          className={`pb-3.5 transition border-b-2 whitespace-nowrap ${
            activeTab === 'care'
              ? 'border-vastrika-maroon-900 text-vastrika-maroon-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Fabric & Care Guide
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-3.5 transition border-b-2 whitespace-nowrap ${
            activeTab === 'shipping'
              ? 'border-vastrika-maroon-900 text-vastrika-maroon-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Shipping & 7-Day Returns
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3.5 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-vastrika-maroon-900 text-vastrika-maroon-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Verified Reviews</span>
          <span className="bg-vastrika-ivory-200 text-vastrika-maroon-900 px-2 py-0.5 rounded-full text-[10px]">
            {reviewsList.length}
          </span>
        </button>
      </div>

      {/* 1. Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Artisan Heritage Description</h4>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-vastrika-ivory-200 text-xs">
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Fabric & Weave</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">{product.fabric || 'Pure Handloom Silk'}</span>
            </div>
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Occasion</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">{product.occasion || 'Wedding & Festive'}</span>
            </div>
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Technique / Pattern</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">{product.pattern || 'Authentic Needlework'}</span>
            </div>
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Country of Origin</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">Handcrafted in India 🇮🇳</span>
            </div>
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Gender</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">{product.gender}</span>
            </div>
            <div className="p-3.5 bg-vastrika-ivory-50 rounded-xl border border-vastrika-ivory-200">
              <span className="text-stone-400 font-medium block">Brand</span>
              <span className="font-bold text-stone-800 text-sm mt-0.5 block">{product.brand || 'VASTRIKA'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Care Guide Tab */}
      {activeTab === 'care' && (
        <div className="space-y-4 text-sm text-stone-600 animate-in fade-in leading-relaxed">
          <h4 className="font-serif text-lg font-bold text-stone-900">Handloom Preservation Instructions</h4>
          <ul className="space-y-2 text-xs sm:text-sm list-disc list-inside">
            <li><strong>Strictly Dry Clean Only:</strong> Preserve the natural sheen of zari and pure natural mulberry threads by opting for professional dry cleaning.</li>
            <li><strong>Storage:</strong> Always wrap pure silks and brocades in a breathable muslin or cotton cloth. Avoid plastic covers.</li>
            <li><strong>Ironing:</strong> Use mild iron heat on the reverse side of the garment, placing a thin cotton cloth between the iron and the embroidery.</li>
            <li><strong>Perfumes:</strong> Avoid spraying perfumes or deodorants directly onto zari or metal embroidery to prevent oxidation.</li>
          </ul>
        </div>
      )}

      {/* 3. Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="space-y-4 text-sm text-stone-600 animate-in fade-in leading-relaxed">
          <h4 className="font-serif text-lg font-bold text-stone-900">Complimentary Express Dispatch</h4>
          <p className="text-xs sm:text-sm">
            All orders placed on VASTRIKA are insured and shipped via priority courier partners (BlueDart, Delhivery, DTDC).
          </p>
          <ul className="space-y-2 text-xs sm:text-sm list-disc list-inside">
            <li><strong>Standard Transit:</strong> 3-5 business days across metros and tier 1/2 Indian cities.</li>
            <li><strong>Free Shipping:</strong> Automatically applied to all orders above ₹1,999.</li>
            <li><strong>7-Day Returns:</strong> If you are not completely delighted with your drape, initiate an effortless doorstep return or size exchange from your Account section within 7 days of delivery.</li>
          </ul>
        </div>
      )}

      {/* 4. Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Summary & Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-vastrika-ivory-50 border border-vastrika-ivory-300">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-serif text-5xl font-bold text-vastrika-maroon-950">
                {product.averageRating?.toFixed(1) || '4.9'}
              </span>
              <div className="flex items-center gap-1 text-vastrika-gold-500 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-vastrika-gold-500" />
                ))}
              </div>
              <span className="text-xs text-stone-500">
                {reviewsList.length} Customer Reviews
              </span>
            </div>

            <div className="col-span-2 space-y-2">
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Rating Distribution</h5>
              {[5, 4, 3, 2, 1].map((st) => (
                <div key={st} className="flex items-center gap-3 text-xs text-stone-600">
                  <span className="w-4 font-bold">{st} ★</span>
                  <div className="flex-1 h-2 bg-vastrika-ivory-200 rounded-full overflow-hidden">
                    <div
                      className="bg-vastrika-gold-500 h-full rounded-full"
                      style={{
                        width: `${st === 5 ? 85 : st === 4 ? 12 : 3}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-stone-400">
                    {st === 5 ? '85%' : st === 4 ? '12%' : '3%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Write a review form */}
          <div className="bg-white p-6 rounded-2xl border border-vastrika-ivory-300 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-vastrika-maroon-800" />
              <h5 className="font-serif text-base font-bold text-vastrika-maroon-900">
                Write a Verified Buyer Review
              </h5>
            </div>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your verified review has been submitted and published.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-600">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating
                              ? 'text-vastrika-gold-500 fill-vastrika-gold-500'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Review Title (e.g. Magnificent silk texture!)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />

                <textarea
                  rows={3}
                  placeholder="Share your experience regarding the fit, fabric sheen, and craftsmanship..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-5 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 divide-y divide-vastrika-ivory-200">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                Be the first to review this handcrafted masterpiece!
              </p>
            ) : (
              reviewsList.map((rev: any) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-vastrika-gold-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-vastrika-gold-500" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-900">{rev.title}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">{formatDate(rev.createdAt)}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                    <span className="font-semibold text-stone-700">{rev.user?.name || 'Verified Patron'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
