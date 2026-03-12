import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/i18n/LanguageContext";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t("contactTitle")}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("contactIntro")}
        </p>

        {submitted ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-lg font-medium text-foreground">
              {t("successMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                {t("labelCompany")}
              </label>
              <Input id="company" required placeholder={t("placeholderCompany")} />
            </div>
            <div>
              <label htmlFor="contact-person" className="block text-sm font-medium text-foreground mb-1.5">
                {t("labelContact")}
              </label>
              <Input id="contact-person" required placeholder={t("placeholderContact")} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                {t("labelEmail")}
              </label>
              <Input id="email" type="email" required placeholder={t("placeholderEmail")} />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                {t("labelMessage")}
              </label>
              <Textarea id="message" required placeholder={t("placeholderMessage")} rows={4} />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" required />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                {t("consentText")}
              </label>
            </div>
            <Button type="submit" size="lg" className="w-full">
              {t("submitButton")}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
