import type { CSSProperties } from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCmsSection } from "@/integrations/supabase/cmsContent";
import { cn } from "@/lib/utils";

const serviceKeys = [
  "service1",
  "service2",
  "service3",
  "service4",
  "service5",
  "service6",
  "service7",
];

interface ServicesSectionProps {
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

const ServicesSection = ({ className, contentClassName, style }: ServicesSectionProps) => {
  const { t } = useLanguage();
  const { values } = useCmsSection("offers");

  return (
    <section id="services" className={cn("section-alt", className)} style={style}>
      <div className={cn("container mx-auto max-w-3xl px-4", contentClassName)}>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
          {values.title ?? values.servicesTitle ?? t("servicesTitle")}
        </h2>
        <ul className="space-y-4">
          {serviceKeys.map((key, index) => {
            const cmsKey = values[`item${index + 1}`] ?? values[key];
            return (
              <li key={key} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  {cmsKey ?? t(key)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ServicesSection;
