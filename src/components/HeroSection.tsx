import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCmsSection } from "@/integrations/supabase/cmsContent";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

const HeroSection = ({ className, contentClassName, style }: HeroSectionProps) => {
  const { t } = useLanguage();
  const { values } = useCmsSection("hero");

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={cn("relative flex min-h-[85vh] items-center justify-center overflow-hidden", className)}
      style={{ background: "var(--hero-gradient)", ...style }}
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className={cn("relative container mx-auto max-w-3xl px-4", contentClassName)}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
          {values.title ?? values.heroTitle ?? t("heroTitle")}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 mb-10 leading-relaxed">
          {values.body ?? values.heroText ?? t("heroText")}
        </p>
        <Button variant="hero" size="lg" onClick={scrollToContact} className="text-base px-8 py-6">
          {values.cta ?? values.heroCta ?? t("heroCta")}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
