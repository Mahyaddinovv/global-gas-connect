import { useLanguage } from "@/i18n/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          {t("aboutTitle")}
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("aboutP1")}</p>
          <p>{t("aboutP2")}</p>
          <p>{t("aboutP3")}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
