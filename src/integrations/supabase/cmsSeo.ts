import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

export interface CmsPageRow {
  id: string;
  slug: string;
  title: string | null;
  meta_description: string | null;
  language: string | null;
}

const HOME_SLUG = "home";

export const useHomeSeo = () => {
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  return useQuery({
    queryKey: ["cms_pages_home", langCode],
    queryFn: async (): Promise<CmsPageRow | null> => {
      const { data, error } = await supabase
        .from("cms_pages")
        .select("id, slug, title, meta_description, language")
        .eq("slug", HOME_SLUG)
        .eq("language", langCode)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data ?? null;
    },
  });
};

export const useUpsertHomeSeo = () => {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  return useMutation({
    mutationFn: async ({ title, meta_description }: { title: string; meta_description: string }) => {
      const { data: existing, error: lookupError } = await supabase
        .from("cms_pages")
        .select("id")
        .eq("slug", HOME_SLUG)
        .eq("language", langCode)
        .maybeSingle();

      if (lookupError && lookupError.code !== "PGRST116") {
        throw lookupError;
      }

      if (existing?.id) {
        const { error } = await supabase
          .from("cms_pages")
          .update({
            title,
            meta_description,
            language: langCode,
          })
          .eq("id", existing.id);

        if (error) {
          throw error;
        }
        return;
      }

      const { error } = await supabase.from("cms_pages").insert({
        slug: HOME_SLUG,
        title,
        meta_description,
        language: langCode,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_pages_home"] });
    },
  });
};

