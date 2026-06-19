import { Link } from "@/i18n/routing";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function PackagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tp = await getTranslations("Package");
  
  // Read features from translation JSON
  const featuresObj = tp.raw("features") as Record<string, string>;
  const features = Object.entries(featuresObj).map(([key, val]) => ({ id: key, text: val }));

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {locale === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-gradient">{tp("title")}</h1>
            <p className="text-white/75 max-w-3xl mx-auto text-lg font-medium leading-relaxed">{tp("subtitle")}</p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Price Card */}
          <Reveal delay={0.2}>
            <div className="text-center mb-12 price-card rounded-[2rem] p-10 md:p-14 glow-card">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#7c3aed] rounded-full text-lg font-bold mb-8 shadow-xl">
                <Sparkles className="w-5 h-5" />
                {tp("tagline")}
              </div>
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-2xl text-white/40 line-through font-medium">{tp("price_per_day")}</span>
                <span className="text-7xl md:text-9xl font-black text-white drop-shadow-2xl">{tp("discount_price")}</span>
              </div>
              <p className="text-white/70 text-xl font-medium mb-6">{tp("discount_monthly")}</p>
              <div className="inline-block bg-red-500/90 px-6 py-2.5 rounded-full text-white font-bold text-base shadow-lg badge-pulse">
                🔥 {tp("validity_note")}
              </div>
            </div>
          </Reveal>

          {/* Features */}
          <div className="flex flex-col gap-3.5 mb-14">
            {features.map((feature, idx) => (
              <Reveal key={feature.id} delay={0.08 * idx}>
                <div className="pill-feature flex items-center rounded-2xl p-5 md:p-6 shadow-lg">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#7c3aed] flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ms-5">
                    <h4 className="font-bold text-lg md:text-xl text-gray-800 leading-snug">{feature.text}</h4>
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
    </div>
  );
}
