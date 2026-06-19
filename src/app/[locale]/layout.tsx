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
      <body className="min-h-full flex flex-col bg-nude text-foreground">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-40 bg-nude/80 backdrop-blur-md border-b border-nude-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <Link href="/" className="text-2xl font-bold tracking-tighter text-brand">ZOOMA</Link>
                  <LanguageToggle currentLocale={locale} />
                </div>
                <nav className="hidden md:flex space-x-8 rtl:space-x-reverse items-center">
                  <Link href="/" className="text-foreground hover:text-brand font-medium text-sm transition-colors">{t('home')}</Link>
                  <Link href="/package" className="text-foreground hover:text-brand font-medium text-sm transition-colors">{t('package')}</Link>
                  <Link href="/portfolio" className="text-foreground hover:text-brand font-medium text-sm transition-colors">{t('portfolio')}</Link>
                  <Link href="/contact" className="bg-brand text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-brand-dark transition-colors">{t('contact')}</Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-nude border-t border-nude-dark py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xl font-bold tracking-tighter mb-4 text-brand">ZOOMA</p>
              <p className="text-foreground/70 text-sm">{tf('description')}</p>
              <p className="text-foreground/50 text-xs mt-8">{tf('rights')}</p>
            </div>
          </footer>

          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
