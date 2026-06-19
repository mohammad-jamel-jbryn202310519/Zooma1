import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { MessageCircle } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              {locale === 'ar' ? 'نحن هنا لمساعدتك' : 'We are here to help'}
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-gradient">{t("title")}</h1>
            <p className="text-white/75 text-lg font-medium">{t("subtitle")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-strong rounded-[2rem] p-8 md:p-12 shadow-2xl">
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
