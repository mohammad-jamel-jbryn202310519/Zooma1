import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { CheckCircle2, Sparkles, ArrowRight, Building2, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

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

  const featuresObj = tp.raw("features") as Record<string, string>;
  const features = Object.entries(featuresObj).map(([key, val]) => ({ id: key, text: val }));

  const portfolioItems = (portfolioItemsData as any[]) || [];
  const testimonials = (testimonialsData as any[]) || [];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative pt-16 pb-10 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-24 right-16 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="mb-4 md:mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-white/90 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                {t("badge")}
              </span>
            </div>
            <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter mb-0 leading-[0.85] text-shimmer">
              {t("title")}
            </h1>
            <h2 className="text-xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8 text-white/80">
              {t("subtitle_marketing")}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm md:text-lg text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-medium">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/package" className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3 md:px-10 md:py-4 bg-white text-[#7c3aed] rounded-full font-bold text-sm md:text-lg shadow-xl">
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== PACKAGE PREVIEW ===== */}
      <section className="py-10 md:py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center mb-8 md:mb-14">
              <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-4 text-gradient">{tp("title")}</h2>
              <p className="text-white/70 max-w-xl mx-auto text-xs md:text-base font-medium leading-relaxed">{tp("subtitle")}</p>
            </div>
          </Reveal>

          <div className="max-w-lg mx-auto relative z-10">
            {/* Price Card */}
            <Reveal delay={0.2}>
              <div className="text-center mb-6 md:mb-10 price-card rounded-2xl md:rounded-3xl p-5 md:p-10 glow-card">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-[#7c3aed] rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  {tp("tagline")}
                </div>
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-1.5 md:mb-3">
                  <span className="text-sm md:text-xl text-white/40 line-through font-medium">{tp("price_per_day")}</span>
                  <span className="text-4xl md:text-7xl font-black text-white drop-shadow-xl">{tp("discount_price")}</span>
                </div>
                <p className="text-white/65 text-xs md:text-base font-medium mb-3">{tp("discount_monthly")}</p>
                <div className="inline-block bg-red-500/90 px-3 py-1 md:px-5 md:py-2 rounded-full text-white font-bold text-[10px] md:text-xs shadow-lg badge-pulse">
                  🔥 {tp("validity_note")}
                </div>
              </div>
            </Reveal>

            {/* Features */}
            <div className="flex flex-col gap-2 md:gap-3 mb-8 md:mb-12">
              {features.map((feature, idx) => (
                <Reveal key={feature.id} delay={0.06 * idx}>
                  <div className="pill-feature flex items-center rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md">
                    <div className="flex-shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-lg bg-[#7c3aed] flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="ms-2.5 md:ms-4">
                      <h4 className="font-semibold text-xs md:text-sm text-gray-800 leading-snug">{feature.text}</h4>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA */}
            <Reveal delay={0.5}>
              <div className="text-center">
                <Link href="/contact" className="btn-glow inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 md:px-12 md:py-5 bg-white text-[#7c3aed] rounded-full font-bold text-sm md:text-xl shadow-xl">
                  {tp("cta")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== COMPANIES CARD ===== */}
      <section className="py-10 md:py-16 relative">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="price-card rounded-2xl md:rounded-3xl p-6 md:p-10 text-center relative overflow-hidden">
              {/* Gold accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-amber-400/20 text-amber-200 rounded-full text-xs font-bold mb-5 md:mb-6 border border-amber-400/30">
                <Building2 className="w-3.5 h-3.5" />
                {tc("title")}
              </div>
              
              <div className="mb-4">
                <span className="text-4xl md:text-6xl font-black text-white drop-shadow-xl">{tc("price")}</span>
              </div>
              
              <div className="inline-block bg-red-500/90 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-white font-bold text-[10px] md:text-xs shadow-lg badge-pulse mb-5">
                🔥 {tc("validity_note")}
              </div>
              
              <p className="text-white/70 text-xs md:text-sm mb-6 leading-relaxed">{tc("description")}</p>
              
              <a
                href="https://wa.me/962000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow inline-flex items-center justify-center gap-2 w-full px-6 py-3 md:py-4 bg-green-500 text-white rounded-full font-bold text-sm md:text-base shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                {tc("cta")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
