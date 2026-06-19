import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Hero");
  const tp = await getTranslations("Package");
  
  const [
    { data: portfolioItemsData },
    { data: testimonialsData },
  ] = await Promise.all([
    supabase.from("portfolio_items").select("*").order("sort_order").limit(3),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
  ]);

  // Read features from translation JSON
  const featuresObj = tp.raw("features") as Record<string, string>;
  const features = Object.entries(featuresObj).map(([key, val]) => ({ id: key, text: val }));

  const portfolioItems = (portfolioItemsData as any[]) || [];
  const testimonials = (testimonialsData as any[]) || [];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                {locale === 'ar' ? 'وكالة رقمية متكاملة' : 'All-in-One Digital Agency'}
              </span>
            </div>
            <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-0 leading-[0.85] text-shimmer">
              {t("title")}
            </h1>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10 text-white/80">
              {t("subtitle_marketing")}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/package" className="btn-glow inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-[#7c3aed] rounded-full font-black text-xl shadow-2xl">
                {t("cta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== PACKAGE PREVIEW ===== */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-gradient">{tp("title")}</h2>
              <p className="text-white/75 max-w-2xl mx-auto text-lg font-medium leading-relaxed">{tp("subtitle")}</p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto relative z-10">
            {/* Price Card */}
            <Reveal delay={0.2}>
              <div className="text-center mb-10 price-card rounded-3xl p-10 glow-card">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#7c3aed] rounded-full text-base font-bold mb-8 shadow-xl">
                  <Sparkles className="w-4 h-4" />
                  {tp("tagline")}
                </div>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-xl text-white/40 line-through font-medium">{tp("price_per_day")}</span>
                  <span className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl">{tp("discount_price")}</span>
                </div>
                <p className="text-white/70 text-lg font-medium mb-4">{tp("discount_monthly")}</p>
                <div className="inline-block bg-red-500/90 px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg badge-pulse">
                  🔥 {tp("validity_note")}
                </div>
              </div>
            </Reveal>

            {/* Features */}
            <div className="flex flex-col gap-3.5 mb-14">
              {features.map((feature, idx) => (
                <Reveal key={feature.id} delay={0.08 * idx}>
                  <div className="pill-feature flex items-center rounded-2xl p-4 md:p-5 shadow-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#7c3aed] flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="ms-4">
                      <h4 className="font-bold text-base md:text-lg text-gray-800 leading-snug">{feature.text}</h4>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA */}
            <Reveal delay={0.6}>
              <div className="text-center">
                <Link href="/contact" className="btn-glow inline-flex items-center justify-center gap-3 w-full sm:w-auto px-14 py-6 bg-white text-[#7c3aed] rounded-full font-black text-2xl shadow-2xl">
                  {tp("cta")}
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
