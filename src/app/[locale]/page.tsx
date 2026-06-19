import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Hero");
  const tp = await getTranslations("Package");
  
  const [
    { data: packageFeaturesData },
    { data: portfolioItemsData },
    { data: testimonialsData },
  ] = await Promise.all([
    supabase.from("package_features").select("*").order("sort_order").limit(6),
    supabase.from("portfolio_items").select("*").order("sort_order").limit(3),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
  ]);

  const features = (packageFeaturesData as any[]) || [];
  const portfolioItems = (portfolioItemsData as any[]) || [];
  const testimonials = (testimonialsData as any[]) || [];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-nude overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nude-light to-beige opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              {t("title").split("Zooma")[0]}
              <span className="text-brand">ZOOMA</span>
              {t("title").split("Zooma")[1] || ""}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/package" className="px-8 py-4 bg-brand text-white rounded-full font-bold text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30">
                {t("cta")}
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white border border-nude-dark text-brand rounded-full font-bold text-lg hover:bg-nude-dark transition-colors">
                {t("secondaryCta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">{tp("title")}</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">{tp("subtitle")}</p>
            </div>
          </Reveal>

          <div className="max-w-4xl mx-auto bg-nude rounded-3xl p-8 md:p-12 border border-beige shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <Reveal delay={0.2}>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-1.5 bg-brand/10 text-brand rounded-full text-sm font-bold mb-6">
                  {tp("tagline")}
                </div>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-2xl text-foreground/40 line-through">{tp("price_per_day")}</span>
                  <span className="text-5xl md:text-6xl font-extrabold text-brand">{tp("discount_price")}</span>
                </div>
                <p className="text-foreground/60">({tp("discount_monthly")})</p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((feature, idx) => (
                <Reveal key={feature.id} delay={0.1 * idx}>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand shrink-0 mt-1" />
                    <div className="ms-4">
                      <h4 className="font-bold text-lg text-foreground">{locale === 'ar' ? feature.title_ar : feature.title_en}</h4>
                      <p className="text-foreground/70 text-sm mt-1">{locale === 'ar' ? feature.description_ar : feature.description_en}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <div className="text-center">
                <Link href="/contact" className="inline-block px-10 py-5 bg-brand text-white rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(141,65,247,0.4)]">
                  {tp("cta")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
