import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
export interface CmsMenuItemRow {
  id: string;
  key: string;
  label: string;
  position: number;
  visible: boolean;
  language: string;
}

export type MenuKey = "about" | "offers" | "contact";

export const MENU_KEYS: { key: MenuKey; defaultHref: string }[] = [
  { key: "about", defaultHref: "#about" },
  { key: "offers", defaultHref: "#services" },
  { key: "contact", defaultHref: "#contact" },
];

export const useMenu = () => {
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  const query = useQuery({
    queryKey: ["cms_menu", langCode],
    queryFn: async (): Promise<CmsMenuItemRow[]> => {
      const { data, error } = await supabase
        .from("cms_menu")
        .select("id, key, label, position, visible, language")
        .eq("language", langCode)
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  return query;
};

export const useUpsertMenuItems = () => {
  const queryClient = useQueryClient();
  const { lang } = useLanguage();
  const langCode = lang.toLowerCase();

  return useMutation({
    mutationFn: async (items: Array<Omit<CmsMenuItemRow, "language"> & { language?: string }>) => {
      const { data: existingRows, error: lookupError } = await supabase
        .from("cms_menu")
        .select("id, key")
        .eq("language", langCode);

      if (lookupError) {
        throw lookupError;
      }

      const existingByKey = new Map((existingRows ?? []).map((row) => [row.key, row.id]));

      for (const item of items) {
        const existingId = existingByKey.get(item.key);
        if (existingId) {
          const { error } = await supabase
            .from("cms_menu")
            .update({
              label: item.label,
              position: item.position,
              visible: item.visible,
              language: langCode,
            })
            .eq("id", existingId);

          if (error) {
            throw error;
          }
          continue;
        }

        const { error } = await supabase.from("cms_menu").insert({
          key: item.key,
          label: item.label,
          position: item.position,
          visible: item.visible,
          language: langCode,
        });

        if (error) {
          throw error;
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_menu"] });
    },
  });
};

