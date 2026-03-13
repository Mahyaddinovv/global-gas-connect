import type { CSSProperties } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCmsSection } from "@/integrations/supabase/cmsContent";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

const AboutSection = ({ className, contentClassName, style }: AboutSectionProps) => {
  const { t } = useLanguage();
  const { values } = useCmsSection("about");

  return (
    <section id="about" className={cn(className)} style={style}>
      <div className={cn("container mx-auto max-w-3xl px-4", contentClassName)}>
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
