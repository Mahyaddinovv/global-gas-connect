import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CmsBlockSection = "hero" | "about" | "offers" | "contact";
export type CmsBlockBackgroundType = "solid" | "gradient";
export type CmsBlockAlignment = "left" | "center" | "right";

export interface CmsBlockRow {
  id: string;
  section: CmsBlockSection;
  order: number;
  visible: boolean;
  bg_type: CmsBlockBackgroundType;
  bg_value: string;
  alignment: CmsBlockAlignment;
  padding: number;
}

export const DEFAULT_BLOCKS: Omit<CmsBlockRow, "id">[] = [
  {
    section: "hero",
    order: 0,
    visible: true,
    bg_type: "gradient",
    bg_value: "var(--hero-gradient)",
    alignment: "center",
    padding: 96,
  },
  {
    section: "about",
    order: 1,
    visible: true,
    bg_type: "solid",
    bg_value: "transparent",
    alignment: "left",
    padding: 96,
  },
  {
    section: "offers",
    order: 2,
    visible: true,
    bg_type: "solid",
    bg_value: "hsl(var(--section-alt))",
    alignment: "left",
    padding: 96,
  },
  {
    section: "contact",
    order: 3,
    visible: true,
    bg_type: "solid",
    bg_value: "transparent",
    alignment: "left",
    padding: 96,
  },
];

export const mergeBlocks = (rows?: CmsBlockRow[] | null): CmsBlockRow[] => {
  const bySection = new Map((rows ?? []).map((row) => [row.section, row]));

  return DEFAULT_BLOCKS.map((block, index) => {
    const existing = bySection.get(block.section);
    return {
      id: existing?.id ?? crypto.randomUUID(),
      section: block.section,
      order: existing?.order ?? index,
      visible: existing?.visible ?? block.visible,
      bg_type: existing?.bg_type ?? block.bg_type,
      bg_value: existing?.bg_value ?? block.bg_value,
      alignment: existing?.alignment ?? block.alignment,
      padding: existing?.padding ?? block.padding,
    };
  }).sort((a, b) => a.order - b.order);
};

export const useBlocks = () =>
  useQuery({
    queryKey: ["cms_blocks"],
    queryFn: async (): Promise<CmsBlockRow[]> => {
      const { data, error } = await supabase
        .from("cms_blocks")
        .select('id, section, order, visible, bg_type, bg_value, alignment, padding')
        .order("order", { ascending: true });

      if (error) {
        if (isMissingBlocksTableError(error)) {
          return [];
        }
        throw error;
      }

      return (data ?? []) as CmsBlockRow[];
    },
  });

export const useUpsertBlocks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blocks: CmsBlockRow[]) => {
      const payload = blocks.map((block, index) => ({
        section: block.section,
        order: index,
        visible: block.visible,
        bg_type: block.bg_type,
        bg_value: block.bg_value,
        alignment: block.alignment,
        padding: block.padding,
      }));

      const { error } = await supabase.from("cms_blocks").upsert(payload, {
        onConflict: "section",
      });

      if (error) {
        if (isMissingBlocksTableError(error)) {
          throw new Error(
            "The cms_blocks table does not exist in Supabase yet. Run the new cms_blocks migration, then refresh this page.",
          );
        }

        // Fall back to row-by-row writes for projects where the unique
        // constraint on section has not been created yet.
        for (const block of payload) {
          const { data: existingRows, error: lookupError } = await supabase
            .from("cms_blocks")
            .select("id")
            .eq("section", block.section);

          if (lookupError) {
            if (isMissingBlocksTableError(lookupError)) {
              throw new Error(
                "The cms_blocks table does not exist in Supabase yet. Run the new cms_blocks migration, then refresh this page.",
              );
            }
            throw lookupError;
          }

          const existingId = existingRows?.[0]?.id;
          if (existingId) {
            const { error: updateError } = await supabase
              .from("cms_blocks")
              .update(block)
              .eq("id", existingId);

            if (updateError) {
              throw updateError;
            }
            continue;
          }

          const { error: insertError } = await supabase.from("cms_blocks").insert({
            ...block,
          });

          if (insertError) {
            throw insertError;
          }
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cms_blocks"] });
    },
  });
};

const isMissingBlocksTableError = (error: { message?: string; code?: string }) =>
  error.code === "PGRST205" ||
  error.message?.includes("public.cms_blocks") ||
  error.message?.includes("schema cache") ||
  error.message?.includes("Could not find the table");
