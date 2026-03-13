import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/i18n/translations";

export interface CmsLanguageRow {
  id: string;
  code: string;
  enabled: boolean;
}

export const ALL_LANGS: Lang[] = ["EN", "ET", "RU", "LV"];

export const useCmsLanguages = () => {
  const query = useQuery({
    queryKey: ["cms_languages"],
    queryFn: async (): Promise<CmsLanguageRow[]> => {
      const { data, error } = await supabase
        .from("cms_languages")
        .select("id, code, enabled")
        .order("code", { ascending: true });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  return query;
};

export const useUpsertLanguages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rows: Array<Pick<CmsLanguageRow, "id" | "code" | "enabled">>) => {
      const { data: existingRows, error: lookupError } = await supabase
        .from("cms_languages")
        .select("id, code");

      if (lookupError) {
        throw lookupError;
      }

      const existingByCode = new Map((existingRows ?? []).map((row) => [row.code.toLowerCase(), row.id]));

      for (const row of rows) {
        const normalizedCode = row.code.toLowerCase();
        const existingId = existingByCode.get(normalizedCode);

        if (existingId) {
          const { error } = await supabase
            .from("cms_languages")
            .update({
              code: normalizedCode,
              enabled: row.enabled,
            })
            .eq("id", existingId);

          if (error) {
            throw error;
          }
          continue;
        }

        const { error } = await supabase.from("cms_languages").insert({
          code: normalizedCode,
          enabled: row.enabled,
        });

        if (error) {
          throw error;
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_languages"] });
    },
  });
};

