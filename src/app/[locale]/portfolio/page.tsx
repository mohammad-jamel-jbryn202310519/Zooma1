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
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              {locale === 'ar' ? 'أعمالنا السابقة' : 'Our Previous Work'}
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-gradient">{t("title")}</h1>
            <p className="text-white/75 max-w-2xl mx-auto text-lg font-medium">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item, idx) => (
              <Reveal key={item.id} delay={0.1 * idx}>
                <div className="group glass rounded-2xl overflow-hidden hover-lift">
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
                        <span className="text-white/20 font-black text-4xl tracking-tighter">ZM</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-white/60 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">{item.business_type}</span>
                    <h3 className="text-xl font-bold mb-2 text-white">{item.client_name}</h3>
                    <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                      {locale === 'ar' ? item.description_ar : item.description_en}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-white font-bold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        {locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                <span className="text-6xl mb-4 block">🚀</span>
                <p className="text-white/50 text-lg font-medium">
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
