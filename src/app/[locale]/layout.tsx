import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "@/i18n/routing";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Zooma - Digital Agency in Jordan",
  description: "Zooma builds complete, production-ready websites and digital systems for local commercial businesses in Jordan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zooma",
  },
};

export const viewport: Viewport = {
  themeColor: "#8d41f7",
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
  const font = locale === 'ar' ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={dir} className={`${font} h-full antialiased`} style={{ '--dir': dir } as React.CSSProperties}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="Zooma Logo" className="h-16 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
                    <span className="hidden text-2xl font-bold tracking-tighter text-white">ZOOMA</span>
                  </Link>
                  <LanguageToggle currentLocale={locale} />
                </div>
                <nav className="hidden md:flex space-x-8 rtl:space-x-reverse items-center">
                  <Link href="/" className="text-white/90 hover:text-white font-medium text-sm transition-colors">{t('home')}</Link>
                  <Link href="/package" className="text-white/90 hover:text-white font-medium text-sm transition-colors">{t('package')}</Link>
                  <Link href="/portfolio" className="text-white/90 hover:text-white font-medium text-sm transition-colors">{t('portfolio')}</Link>
                  <Link href="/contact" className="bg-white text-brand px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">{t('contact')}</Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-background border-t border-white/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <img src="/logo.png" alt="Zooma Logo" className="h-20 w-auto object-contain mx-auto mb-6" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
              <p className="hidden text-xl font-bold tracking-tighter mb-4 text-white">ZOOMA</p>
              <p className="text-white/80 text-sm">{tf('description')}</p>
              <p className="text-white/50 text-xs mt-8">{tf('rights')}</p>
            </div>
          </footer>

          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
