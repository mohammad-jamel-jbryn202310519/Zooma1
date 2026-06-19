import { supabase } from "@/lib/supabase/client";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { Briefcase, ExternalLink } from "lucide-react";

export const revalidate = 60;

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Portfolio");
  
  const { data } = await supabase.from("portfolio_items").select("*").order("sort_order");
  const portfolioItems = (data as any[]) || [];

  return (
    <div className="min-h-screen pt-10 md:pt-24 pb-24 md:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8 md:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-white/90 text-xs font-medium mb-3 md:mb-6">
              <Briefcase className="w-3 h-3" />
              {locale === 'ar' ? 'أعمالنا السابقة' : 'Our Previous Work'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-gradient">{t("title")}</h1>
            <p className="text-white/70 max-w-xl mx-auto text-xs md:text-base font-medium">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item, idx) => (
              <Reveal key={item.id} delay={0.08 * idx}>
                <div className="group glass rounded-xl md:rounded-2xl overflow-hidden hover-lift">
                  <div className="aspect-[4/3] bg-black/20 relative overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.client_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#7c3aed]/30 to-[#4c1d95]/30">
                        <span className="text-white/20 font-black text-2xl md:text-4xl tracking-tighter">ZM</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-5">
                    <span className="inline-block text-white/60 bg-white/10 px-2 py-0.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider mb-1.5 md:mb-3">{item.business_type}</span>
                    <h3 className="text-sm md:text-lg font-bold mb-1 text-white leading-tight">{item.client_name}</h3>
                    <p className="text-white/50 text-[10px] md:text-sm line-clamp-2 leading-relaxed hidden md:block">
                      {locale === 'ar' ? item.description_ar : item.description_en}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="mt-2 md:mt-3 inline-flex items-center gap-1 text-white font-bold bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg hover:bg-white/20 transition-colors text-[10px] md:text-xs">
                        <ExternalLink className="w-3 h-3" />
                        {locale === 'ar' ? 'زيارة' : 'Visit'}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))
          ) : (
            <div className="col-span-full text-center py-12 md:py-20">
              <div className="glass rounded-2xl p-8 md:p-12 max-w-sm mx-auto">
                <span className="text-4xl md:text-6xl mb-3 block">🚀</span>
                <p className="text-white/50 text-sm md:text-base font-medium">
                  {locale === 'ar' ? 'قريباً... أعمال مذهلة!' : 'Coming soon... amazing work!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
