import { supabase } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function PackagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tp = await getTranslations("Package");
  
  const { data } = await supabase.from("package_features").select("*").order("sort_order");
  const features = (data as any[]) || [];

  return (
    <div className="min-h-screen bg-nude pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand">{tp("title")}</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">{tp("subtitle")}</p>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-beige shadow-2xl relative overflow-hidden">
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

          <div className="grid sm:grid-cols-2 gap-8 mb-12">
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
    </div>
  );
}
