import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight, Store, Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import PackageCards from "@/components/PackageCards";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Hero");
  const tp = await getTranslations("Package");
  const tc = await getTranslations("Companies");

  const [
    { data: portfolioItemsData },
    { data: testimonialsData },
  ] = await Promise.all([
    supabase.from("portfolio_items").select("*").order("sort_order").limit(3),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
  ]);

  const portfolioItems = (portfolioItemsData as any[]) || [];

  // Build features arrays
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
    <div className="flex flex-col overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative pt-14 pb-8 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="mb-3 md:mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-white/85 text-[11px] md:text-xs font-semibold tracking-wide">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                {t("badge")}
              </span>
            </div>
            <h1 className="text-[3.5rem] md:text-[7rem] font-black tracking-tighter leading-none mb-0 text-shimmer">
              {t("title")}
            </h1>
            <h2 className="text-lg md:text-3xl font-bold tracking-tight mb-5 md:mb-7 text-white/75 mt-1">
              {t("subtitle_marketing")}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xs md:text-base text-white/65 max-w-xl mx-auto mb-7 md:mb-9 leading-relaxed font-normal">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <Link href="/package" className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-2.5 md:px-9 md:py-3.5 bg-white text-[#7c3aed] rounded-full font-bold text-sm md:text-base shadow-lg">
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== PACKAGES SECTION ===== */}
      <section className="py-8 md:py-16 relative">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-5 md:mb-8">
              <h2 className="text-xl md:text-3xl font-bold mb-1 text-white tracking-tight">
                {locale === 'ar' ? 'باقاتنا' : 'Our Packages'}
              </h2>
              <p className="text-white/55 text-[11px] md:text-sm">
                {locale === 'ar' ? 'اختر الباقة المناسبة لك' : 'Choose the right package for you'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <PackageCards storesData={storesData} companiesData={companiesData} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
