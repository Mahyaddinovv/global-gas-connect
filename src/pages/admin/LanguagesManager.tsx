import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import { ALL_LANGS, useCmsLanguages, useUpsertLanguages } from "@/integrations/supabase/cmsLanguages";
import { useToast } from "@/hooks/use-toast";

const LanguagesManager = () => {
  const { data, isLoading } = useCmsLanguages();
  const { mutateAsync, isPending } = useUpsertLanguages();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const initial = useMemo(
    () =>
      ALL_LANGS.map((code) => {
        const row = data?.find((entry) => entry.code.toUpperCase() === code);
        return {
          id: row?.id ?? crypto.randomUUID(),
          code,
          enabled: row?.enabled ?? true,
        };
      }),
    [data],
  );

  const [rows, setRows] = useState(initial);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const toggleLang = (code: string, enabled: boolean) => {
    setRows((prev) => prev.map((row) => (row.code === code ? { ...row, enabled } : row)));
  };

  const handleSave = async () => {
    try {
      await mutateAsync(rows);

      let auditFailed = false;
      try {
        await createAuditLog({
          action: "Updated language availability",
          section: "languages",
        });
      } catch {
        auditFailed = true;
      }

      toast({
        title: "Languages updated",
        description: auditFailed
          ? "Language availability has been saved. Audit logging failed."
          : "Language availability has been saved.",
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({
        variant: "destructive",
        title: "Save failed",
        description: message,
      });
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-100">Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-xs text-slate-400">Loading languages...</p>}
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.code}
              className="flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-sm"
            >
              <div>
                <div className="font-medium text-slate-100">{row.code}</div>
                <div className="text-xs text-slate-400">
                  {row.enabled ? "Visible in language switcher" : "Hidden from language switcher"}
                </div>
              </div>
              <Switch checked={row.enabled} onCheckedChange={(value) => toggleLang(row.code, value === true)} />
            </div>
          ))}
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving..." : "Save languages"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LanguagesManager;
