import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { MessageCircle } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  return (
    <div className="min-h-screen pt-10 md:pt-24 pb-24 md:pb-32">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-6 md:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-white/90 text-xs font-medium mb-3 md:mb-6">
              <MessageCircle className="w-3 h-3" />
              {locale === 'ar' ? 'نحن هنا لمساعدتك' : 'We are here to help'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-gradient">{t("title")}</h1>
            <p className="text-white/70 text-xs md:text-base font-medium">{t("subtitle")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-strong rounded-2xl md:rounded-[2rem] p-5 md:p-10 shadow-2xl">
            <ContactForm 
              translations={{
                name: t("name"),
                phone: t("phone"),
                business_name: t("business_name"),
                business_type: t("business_type"),
                message: t("message"),
                submit: t("submit"),
                success: t("success")
              }}
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
