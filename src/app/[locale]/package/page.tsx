import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import PackageCards from "@/components/PackageCards";
import { Store, Building2 } from "lucide-react";

export const revalidate = 60;

export default async function PackagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tp = await getTranslations("Package");
  const tc = await getTranslations("Companies");

  const storesFeatures = Object.values(tp.raw("features") as Record<string, string>);
  const companiesFeatures = Object.values(tc.raw("features") as Record<string, string>);

  const storesData = {
    type: 'stores' as const,
    icon: <Store className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#a78bfa' }} />,
    badge: locale === 'ar' ? 'للمتاجر والمحلات' : 'For Stores & Shops',
    badgeColor: '#a78bfa',
    title: tp("title"),
    originalPrice: tp("price_per_day"),
    discountPrice: tp("discount_price"),
    discountNote: tp("discount_monthly"),
    validityNote: tp("validity_note"),
    features: storesFeatures,
    ctaLabel: tp("cta"),
    ctaHref: '/contact',
    accentColor: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.15)',
  };

  const companiesData = {
    type: 'companies' as const,
    icon: <Building2 className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#fbbf24' }} />,
    badge: locale === 'ar' ? 'للشركات والمؤسسات' : 'For Companies & Businesses',
    badgeColor: '#fbbf24',
    title: tc("title"),
    originalPrice: tc("original_price"),
    discountPrice: tc("discount_price"),
    discountNote: tc("discount_monthly"),
    validityNote: tc("validity_note"),
    features: companiesFeatures,
    ctaLabel: tc("cta"),
    ctaWhatsapp: 'https://wa.me/962000000000',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.15)',
  };

  return (
    <div className="min-h-screen pt-10 md:pt-20 pb-28 md:pb-32">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-1.5 text-white tracking-tight">
              {locale === 'ar' ? 'باقاتنا' : 'Our Packages'}
            </h1>
            <p className="text-white/55 text-xs md:text-sm">
              {locale === 'ar' ? 'اختر الباقة المناسبة لنشاطك' : 'Choose the right package for your business'}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <PackageCards storesData={storesData} companiesData={companiesData} />
        </Reveal>
      </div>
    </div>
  );
}
