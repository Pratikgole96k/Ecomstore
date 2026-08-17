import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Users,
  Boxes,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-vastrika-charcoal-950 text-white flex flex-col justify-between shrink-0 p-5 border-r border-stone-800">
        <div className="space-y-6">
          {/* Admin Brand */}
          <div className="border-b border-stone-800 pb-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                VASTRIKA
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-vastrika-gold-400">
                Admin Management Studio
              </p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition"
                >
                  <Icon className="w-4 h-4 text-vastrika-gold-500" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-stone-400 hover:text-white p-2 rounded-lg hover:bg-stone-900 transition"
          >
            <span>Visit Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-vastrika-gold-400" />
          </Link>

          <div className="flex items-center gap-2 p-2 bg-stone-900/80 rounded-xl border border-stone-800">
            <div className="w-7 h-7 rounded-full bg-vastrika-maroon-800 text-vastrika-gold-300 font-bold text-xs flex items-center justify-center">
              A
            </div>
            <div className="text-[11px] min-w-0">
              <p className="font-bold text-white truncate">Administrator</p>
              <p className="text-stone-400 text-[10px] truncate">admin@vastrika.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
