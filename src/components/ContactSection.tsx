import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCmsSection } from "@/integrations/supabase/cmsContent";
import { useFormConfig, DEFAULT_FORM_FIELDS } from "@/integrations/supabase/cmsForms";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const { values } = useCmsSection("contact");
  const { data: formConfig } = useFormConfig();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const inquiryData = {
      company_name: (formData.get("company") as string).trim(),
      contact_person: (formData.get("contact-person") as string).trim(),
      email: (formData.get("email") as string).trim(),
      message: (formData.get("message") as string).trim(),
    };

    const inquiryId = crypto.randomUUID();

    const { error } = await supabase.from("inquiries").insert({
      id: inquiryId,
      ...inquiryData,
      consent,
      team_slug: "mahammad-m",
      source: "ai-web-2026",
      language: lang.toLowerCase(),
    });

    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: t("errorTitle") ?? "Error",
        description: t("errorMessage") ?? "Something went wrong. Please try again later.",
      });
      return;
    }

    // Send email notification (fire-and-forget) — only pass the ID
    supabase.functions.invoke("send-inquiry-email", {
      body: { id: inquiryId },
    }).catch(console.error);

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {values.title ?? values.contactTitle ?? t("contactTitle")}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {values.intro ?? values.contactIntro ?? t("contactIntro")}
        </p>

        {submitted ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-lg font-medium text-foreground">
              {t("successMessage")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {buildOrderedFields(formConfig).map((field) => {
              if (field.key === "company") {
                return (
                  <div key={field.key}>
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label ??
                        values.label_company ??
                        values.labelCompany ??
                        t("labelCompany")}
                    </label>
                    <Input
                      id="company"
                      name="company"
                      required={field.required}
                      placeholder={
                        field.placeholder ??
                        values.placeholder_company ??
                        values.placeholderCompany ??
                        t("placeholderCompany")
                      }
                    />
                  </div>
                );
              }
              if (field.key === "contactPerson") {
                return (
                  <div key={field.key}>
                    <label
                      htmlFor="contact-person"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      {field.label ??
                        values.label_contact ??
                        values.labelContact ??
                        t("labelContact")}
                    </label>
                    <Input
                      id="contact-person"
                      name="contact-person"
                      required={field.required}
                      placeholder={
                        field.placeholder ??
                        values.placeholder_contact ??
                        values.placeholderContact ??
                        t("placeholderContact")
                      }
                    />
                  </div>
                );
              }
              if (field.key === "email") {
                return (
                  <div key={field.key}>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label ?? values.label_email ?? values.labelEmail ?? t("labelEmail")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required={field.required}
                      placeholder={
                        field.placeholder ??
                        values.placeholder_email ??
                        values.placeholderEmail ??
                        t("placeholderEmail")
                      }
                    />
                  </div>
                );
              }
              if (field.key === "message") {
                return (
                  <div key={field.key}>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label ??
                        values.label_message ??
                        values.labelMessage ??
                        t("labelMessage")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required={field.required}
                      placeholder={
                        field.placeholder ??
                        values.placeholder_message ??
                        values.placeholderMessage ??
                        t("placeholderMessage")
                      }
                      rows={4}
                    />
                  </div>
                );
              }
              if (field.key === "consent") {
                return (
                  <div key={field.key} className="flex items-start gap-2">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-muted-foreground leading-snug cursor-pointer"
                    >
                      {field.label ?? values.consent ?? values.consentText ?? t("consentText")}
                    </label>
                  </div>
                );
              }
              return null;
            })}
            <Button type="submit" size="lg" className="w-full" disabled={loading || !consent}>
              {loading ? "..." : values.button ?? values.submitButton ?? t("submitButton")}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;

const buildOrderedFields = (config: ReturnType<typeof useFormConfig>["data"]) => {
  if (config && config.length > 0) {
    return config
      .map((row) => ({
        key: row.field_key as (typeof DEFAULT_FORM_FIELDS)[number]["key"],
        label: row.label ?? "",
        placeholder: row.placeholder ?? "",
        required: row.required,
        position: row.position,
      }))
      .sort((a, b) => a.position - b.position);
  }

  return DEFAULT_FORM_FIELDS.map((f, index) => ({
    key: f.key,
    label: "",
    placeholder: "",
    required: f.key !== "consent",
    position: index,
  }));
};
