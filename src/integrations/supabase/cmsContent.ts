import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/integrations/supabase/auth";

export type CmsSection = "hero" | "about" | "offers" | "contact";

export interface CmsContentRow {
  id: string;
  section: string;
  key: string;
  value: string;
  language: string;
}

export const CMS_LANGS: Lang[] = ["EN", "ET", "RU", "LV"];

export const useCmsSection = (section: CmsSection) => {
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  const query = useQuery({
    queryKey: ["cms_content", section, langCode],
    queryFn: async (): Promise<CmsContentRow[]> => {
      const { data, error } = await supabase
        .from("cms_content")
        .select("id, section, key, value, language")
        .eq("section", section)
        .eq("language", langCode);

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  const map: Record<string, string> = {};
  for (const row of query.data ?? []) {
    map[row.key] = row.value;
  }

  return {
    ...query,
    values: map,
  };
};

export const useCmsContentAll = (language: Lang) => {
  return useQuery({
    queryKey: ["cms_content_all", language],
    queryFn: async (): Promise<CmsContentRow[]> => {
      const { data, error } = await supabase
        .from("cms_content")
        .select("id, section, key, value, language, updated_at, updated_by")
        .eq("language", language.toLowerCase())
        .order("section", { ascending: true })
        .order("key", { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []) as CmsContentRow[];
    },
  });
};

export const useUpdateCmsContent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from("cms_content")
        .update({
          value,
          updated_at: new Date().toISOString(),
          updated_by: user?.id ?? null,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, _vars, _ctx) => {
      void queryClient.invalidateQueries({ queryKey: ["cms_content_all"] });
      void queryClient.invalidateQueries({ queryKey: ["cms_content"] });
    },
  });
};

