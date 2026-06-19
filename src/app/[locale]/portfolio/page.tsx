import { supabase } from "@/lib/supabase/client";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import Image from "next/image";

export const revalidate = 60;

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Portfolio");
  
  const { data } = await supabase.from("portfolio_items").select("*").order("sort_order");
  const portfolioItems = (data as any[]) || [];

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand">{t("title")}</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item, idx) => (
              <Reveal key={item.id} delay={0.1 * idx}>
                <div className="group rounded-3xl overflow-hidden bg-nude border border-beige hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-nude-dark relative overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.client_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-foreground/20 font-bold text-2xl">
                        ZOOMA
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-brand text-xs font-bold uppercase tracking-wider mb-2 block">{item.business_type}</span>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{item.client_name}</h3>
                    <p className="text-foreground/70 text-sm line-clamp-2">
                      {locale === 'ar' ? item.description_ar : item.description_en}
                    </p>
                    {item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-brand font-semibold hover:underline text-sm">
                        {locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))
          ) : (
            <div className="col-span-full text-center text-foreground/50 py-10">Portfolio coming soon.</div>
          )}
        </div>
      </div>
    </div>
  );
}
