import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight, Store, Building2, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import PackageCards from "@/components/PackageCards";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Hero");
  const tp = await getTranslations("Package");
  const tc = await getTranslations("Companies");
  const ta = await getTranslations("About");

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
    ctaWhatsapp: 'https://wa.me/962000000000',
    ctaWhatsappLabel: locale === 'ar' ? 'التفاصيل عبر الواتساب' : 'Details via WhatsApp',
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
    ctaHref: '/contact',
    ctaWhatsapp: 'https://wa.me/962000000000',
    ctaWhatsappLabel: locale === 'ar' ? 'التفاصيل عبر الواتساب' : 'Details via WhatsApp',
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

      {/* ===== ABOUT US SECTION ===== */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#7c3aed]/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-black mb-3 text-white tracking-tight">
                {ta("title")}
              </h2>
              <p className="text-[#a78bfa] font-semibold text-sm md:text-lg">
                {ta("subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="glass-strong rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl space-y-8 md:space-y-12">
            
            {/* Introduction */}
            <Reveal delay={0.1}>
              <p 
                className="text-base md:text-xl text-white/90 leading-relaxed font-medium text-center md:text-start"
                dangerouslySetInnerHTML={{ __html: ta.raw("p1") }}
              />
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* What we offer */}
              <Reveal delay={0.2}>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#fbbf24] flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {ta("h_offer")}
                  </h3>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a78bfa]" />
                        </div>
                        <p className="text-sm md:text-base text-white/80 leading-relaxed">{ta(`f${i}`)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Benefits */}
              <Reveal delay={0.3}>
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#22c55e] flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    {ta("h_why")}
                  </h3>
                  <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#22c55e]/10 blur-3xl rounded-full pointer-events-none" />
                    <p 
                      className="text-sm md:text-base text-white/85 leading-loose relative z-10"
                      dangerouslySetInnerHTML={{ __html: ta.raw("p2") }}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
