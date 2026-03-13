import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

export type FormFieldKey = "company" | "contactPerson" | "email" | "message" | "consent";

export interface CmsFormFieldRow {
  id: string;
  field_key: string;
  label: string | null;
  placeholder: string | null;
  required: boolean;
  position: number;
  language: string;
}

export const DEFAULT_FORM_FIELDS: { key: FormFieldKey; name: string }[] = [
  { key: "company", name: "company" },
  { key: "contactPerson", name: "contact-person" },
  { key: "email", name: "email" },
  { key: "message", name: "message" },
  { key: "consent", name: "consent" },
];

export const useFormConfig = () => {
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  return useQuery({
    queryKey: ["cms_forms", langCode],
    queryFn: async (): Promise<CmsFormFieldRow[]> => {
      const { data, error } = await supabase
        .from("cms_forms")
        .select("id, field_key, label, placeholder, required, position, language")
        .eq("language", langCode)
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
};

export const useUpsertFormFields = () => {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  return useMutation({
    mutationFn: async (fields: Array<Omit<CmsFormFieldRow, "language"> & { language?: string }>) => {
      const { data: existingRows, error: lookupError } = await supabase
        .from("cms_forms")
        .select("id, field_key")
        .eq("language", langCode);

      if (lookupError) {
        throw lookupError;
      }

      const existingByKey = new Map((existingRows ?? []).map((row) => [row.field_key, row.id]));

      for (const field of fields) {
        const existingId = existingByKey.get(field.field_key);

        if (existingId) {
          const { error } = await supabase
            .from("cms_forms")
            .update({
              label: field.label,
              placeholder: field.placeholder,
              required: field.required,
              position: field.position,
              language: langCode,
            })
            .eq("id", existingId);

          if (error) {
            throw error;
          }
          continue;
        }

        const { error } = await supabase.from("cms_forms").insert({
          field_key: field.field_key,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          position: field.position,
          language: langCode,
        });

        if (error) {
          throw error;
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_forms"] });
    },
  });
};

