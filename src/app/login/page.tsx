'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitAuth = async (authEmail: string, authPass: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to login');
      }

      // If logging in as admin and redirect was default /account, forward to /admin
      let destination = redirect;
      if (data.user?.role === 'ADMIN' && (redirect === '/account' || redirect === '/login')) {
        destination = '/admin';
      }

      // Full navigation to ensure cookie refresh
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    submitAuth(email, password);
  };

  const handleQuickLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@vastrika.com');
      setPassword('admin123');
      submitAuth('admin@vastrika.com', 'admin123');
    } else {
      setEmail('customer@vastrika.com');
      setPassword('customer123');
      submitAuth('customer@vastrika.com', 'customer123');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-vastrika-ivory-300 shadow-luxury space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-vastrika-gold-700">
          Welcome to VASTRIKA
        </span>
        <h1 className="font-serif text-3xl font-bold text-vastrika-maroon-950">Sign In</h1>
        <p className="text-xs text-stone-500">
          Access your orders, addresses, and wishlist.
        </p>
      </div>

      {/* 1-Click Fast Login Pills */}
      <div className="p-3.5 bg-vastrika-ivory-100/80 rounded-2xl border border-vastrika-ivory-300 space-y-2">
        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block text-center">
          ⚡ 1-Click Instant Demo Login
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('admin')}
            className="py-2 px-3 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-vastrika-gold-400" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('customer')}
            className="py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-vastrika-ivory-300 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 text-vastrika-maroon-800" />
            <span>Customer</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800 text-stone-900"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-stone-700">Password</label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-vastrika-maroon-800 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800 text-stone-900"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-stone-500 border-t border-vastrika-ivory-200">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="text-vastrika-maroon-800 font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-vastrika-gold-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
