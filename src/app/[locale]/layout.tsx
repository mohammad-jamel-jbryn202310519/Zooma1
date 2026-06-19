import type { Metadata, Viewport } from "next";
import { Outfit, Cairo } from "next/font/google";
import "../globals.css";
import Globe3D from "@/components/Globe3D";
import MobileMenu from "@/components/MobileMenu";
import { Link } from "@/i18n/routing";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import LanguageToggle from "@/components/LanguageToggle";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "ZOOMA Marketing — Digital Agency in Jordan",
  description: "ZOOMA Marketing builds complete, production-ready websites and digital systems for local commercial businesses in Jordan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ZOOMA",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations('Navigation');
  const tf = await getTranslations('Footer');
  
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const font = locale === 'ar' ? cairo.className : outfit.className;

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/package', label: t('package') },
    { href: '/portfolio', label: t('portfolio') },
  ];

  return (
    <html lang={locale} dir={dir} className={`${font} h-full antialiased scroll-smooth`} style={{ '--dir': dir } as React.CSSProperties}>
      <body className="min-h-full flex flex-col text-white">
        <NextIntlClientProvider messages={messages}>
          <Globe3D />
          
          {/* ===== HEADER ===== */}
          <header className="sticky top-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14 md:h-20">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo.jpeg" alt="Zooma Logo" className="h-9 w-9 md:h-12 md:w-12 rounded-lg md:rounded-xl object-cover shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                    <div className="flex flex-col">
                      <span className="text-sm md:text-lg font-black tracking-tighter text-white leading-tight">ZOOMA</span>
                      <span className="text-[8px] md:text-[10px] font-medium text-white/60 tracking-widest uppercase">Marketing</span>
                    </div>
                  </Link>
                  <LanguageToggle currentLocale={locale} />
                </div>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href as any} className="text-white/80 hover:text-white font-medium text-sm transition-all px-4 py-2 rounded-full hover:bg-white/10">
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/contact" className="ms-2 bg-white text-[#7c3aed] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    {t('contact')}
                  </Link>
                </nav>

                {/* Mobile Menu */}
                <MobileMenu
                  links={navLinks}
                  ctaLink={{ href: '/contact', label: t('contact') }}
                />
              </div>
            </div>
          </header>
          
          {/* ===== MAIN ===== */}
          <main className="flex-grow relative z-10 pb-20 md:pb-0">
            {children}
          </main>

          {/* ===== FOOTER ===== */}
          <footer className="relative z-10 border-t border-white/10 py-16 mt-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img src="/logo.jpeg" alt="Zooma Logo" className="h-14 w-14 rounded-xl object-cover shadow-lg ring-2 ring-white/20" />
                <div className="flex flex-col items-start">
                  <span className="text-xl font-black tracking-tighter text-white">ZOOMA</span>
                  <span className="text-xs font-medium text-white/50 tracking-widest uppercase">Marketing</span>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">{tf('description')}</p>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/30 text-xs">{tf('rights')}</p>
              </div>
            </div>
          </footer>


          {/* ===== MOBILE BOTTOM NAV ===== */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/20" style={{ background: 'rgba(30, 10, 60, 0.95)', backdropFilter: 'blur(20px)' }}>
            <div className="flex justify-around items-center h-[60px] px-1">
              <Link href="/" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors py-1.5 px-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="text-[11px] font-bold">{t('home')}</span>
              </Link>
              <Link href="/package" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors py-1.5 px-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span className="text-[11px] font-bold">{t('package')}</span>
              </Link>
              <Link href="/portfolio" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors py-1.5 px-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <span className="text-[11px] font-bold">{t('portfolio')}</span>
              </Link>
              <Link href="/contact" className="flex flex-col items-center gap-0.5 py-1.5 px-2">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center -mt-3 shadow-lg shadow-purple-500/40">
                  <svg className="w-4.5 h-4.5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-white">{t('contact')}</span>
              </Link>
            </div>
          </nav>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
