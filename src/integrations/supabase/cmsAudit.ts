import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/integrations/supabase/auth";

export type CmsAuditSection = "content" | "seo" | "menu" | "forms" | "languages" | "builder";

export interface CmsAuditRow {
  id: string;
  user_email: string;
  action: string;
  section: CmsAuditSection;
  changed_at: string;
}

export const useAuditLogs = (limit?: number) =>
  useQuery({
    queryKey: ["cms_audit", limit ?? "all"],
    queryFn: async (): Promise<CmsAuditRow[]> => {
      let query = supabase
        .from("cms_audit")
        .select("id, user_email, action, section, changed_at")
        .order("changed_at", { ascending: false });

      if (typeof limit === "number") {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("public.cms_audit")) {
          return [];
        }
        throw error;
      }

      return (data ?? []) as CmsAuditRow[];
    },
  });

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ action, section }: { action: string; section: CmsAuditSection }) => {
      const { error } = await supabase.from("cms_audit").insert({
        user_email: user?.email ?? "Unknown user",
        action,
        section,
        changed_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_audit"] });
    },
  });
};
