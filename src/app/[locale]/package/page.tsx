import { Link } from "@/i18n/routing";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function PackagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tp = await getTranslations("Package");
  
  const featuresObj = tp.raw("features") as Record<string, string>;
  const features = Object.entries(featuresObj).map(([key, val]) => ({ id: key, text: val }));

  return (
    <div className="min-h-screen pt-12 md:pt-24 pb-24 md:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-8 md:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-white/90 text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3" />
              {locale === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
            </span>
            <h1 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 text-gradient">{tp("title")}</h1>
            <p className="text-white/70 max-w-2xl mx-auto text-xs md:text-base font-medium leading-relaxed">{tp("subtitle")}</p>
          </div>
        </Reveal>

        <div className="max-w-lg mx-auto relative z-10">
          {/* Price Card */}
          <Reveal delay={0.2}>
            <div className="text-center mb-8 md:mb-12 price-card rounded-2xl md:rounded-[2rem] p-6 md:p-12 glow-card">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 md:px-6 md:py-3 bg-white text-[#7c3aed] rounded-full text-xs md:text-base font-bold mb-5 md:mb-8 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                {tp("tagline")}
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-base md:text-2xl text-white/40 line-through font-medium">{tp("price_per_day")}</span>
                <span className="text-5xl md:text-8xl font-black text-white drop-shadow-xl">{tp("discount_price")}</span>
              </div>
              <p className="text-white/65 text-sm md:text-lg font-medium mb-4">{tp("discount_monthly")}</p>
              <div className="inline-block bg-red-500/90 px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-white font-bold text-[10px] md:text-sm shadow-lg badge-pulse">
                🔥 {tp("validity_note")}
              </div>
            </div>
          </Reveal>

          {/* Features */}
          <div className="flex flex-col gap-2 md:gap-3.5 mb-8 md:mb-14">
            {features.map((feature, idx) => (
              <Reveal key={feature.id} delay={0.06 * idx}>
                <div className="pill-feature flex items-center rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#7c3aed] flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="ms-3 md:ms-4">
                    <h4 className="font-semibold text-xs md:text-base text-gray-800 leading-snug">{feature.text}</h4>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.5}>
            <div className="text-center">
              <Link href="/contact" className="btn-glow inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 md:px-14 md:py-5 bg-white text-[#7c3aed] rounded-full font-bold text-sm md:text-xl shadow-xl">
                {tp("cta")}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
