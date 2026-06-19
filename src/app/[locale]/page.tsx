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
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-transparent overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-light opacity-30 rounded-full blur-[100px]"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-white opacity-10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/package" className="px-8 py-4 bg-white text-brand rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
                {t("cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="py-16 bg-transparent relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md">{tp("title")}</h2>
              <p className="text-white/90 max-w-2xl mx-auto text-xl font-medium">{tp("subtitle")}</p>
            </div>
          </Reveal>

          <div className="max-w-2xl mx-auto relative z-10">
            <Reveal delay={0.2}>
              <div className="text-center mb-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="inline-block px-5 py-2 bg-white text-brand rounded-full text-lg font-bold mb-6 shadow-lg">
                  {tp("tagline")}
                </div>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-2xl text-white/60 line-through">{tp("price_per_day")}</span>
                  <span className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">{tp("discount_price")}</span>
                </div>
                <p className="text-white/80 text-lg font-medium">{tp("discount_monthly")}</p>
                <div className="mt-4 inline-block bg-brand px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg animate-pulse">
                  {tp("validity_note")}
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col gap-4 mb-12">
              {features.map((feature, idx) => (
                <Reveal key={feature.id} delay={0.1 * idx}>
                  <div className="flex items-center bg-[#e6d9f9] rounded-full p-4 md:p-5 shadow-lg border border-white/50 hover:scale-[1.02] transition-transform">
                    <CheckCircle2 className="w-8 h-8 text-brand shrink-0" />
                    <div className="ms-4">
                      <h4 className="font-extrabold text-lg md:text-xl text-gray-900 leading-tight">{feature.text}</h4>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <div className="text-center">
                <Link href="/contact" className="inline-block w-full sm:w-auto px-12 py-5 bg-white text-brand rounded-full font-black text-2xl hover:bg-gray-100 transition-transform hover:scale-105 shadow-2xl">
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
