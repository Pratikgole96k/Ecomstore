import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/hooks/useCart';
import { WishlistProvider } from '@/hooks/useWishlist';
import Header from '@/components/layout/Header';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VASTRIKA | Luxury Indian Ethnic Wear & Handcrafted Couture',
  description:
    'Discover heirloom Banarasi silk sarees, bridal lehengas, authentic Lucknowi Chikankari kurtis, and royal menswear. Tradition woven into every story.',
  keywords: [
    'Indian Clothing',
    'Banarasi Saree',
    'Bridal Lehenga',
    'Chikankari Kurti',
    'Anarkali Suit',
    'Nehru Jacket',
    'Indian Fashion',
    'Ethnic Wear',
    'VASTRIKA',
  ],
  openGraph: {
    title: 'VASTRIKA | Handcrafted Indian Heritage Couture',
    description: 'Tradition woven into every story. Explore luxury handcrafted Indian ethnic wear.',
    url: 'https://vastrika.com',
    siteName: 'VASTRIKA',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col justify-between bg-vastrika-ivory-50 text-stone-900 font-sans antialiased selection:bg-vastrika-maroon-100 selection:text-vastrika-maroon-900">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
