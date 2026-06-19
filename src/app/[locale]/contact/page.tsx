import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md">{t("title")}</h1>
            <p className="text-white/80 text-lg font-medium">{t("subtitle")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
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
