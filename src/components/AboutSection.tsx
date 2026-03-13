import { useLanguage } from "@/i18n/LanguageContext";
import { useCmsSection } from "@/integrations/supabase/cmsContent";

const AboutSection = () => {
  const { t } = useLanguage();
  const { values } = useCmsSection("about");

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          {values.title ?? values.aboutTitle ?? t("aboutTitle")}
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{values.body ?? values.aboutP1 ?? t("aboutP1")}</p>
          <p>{values.aboutP2 ?? t("aboutP2")}</p>
          <p>{values.aboutP3 ?? t("aboutP3")}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
