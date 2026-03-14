import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import { useHomeSeo, useUpsertHomeSeo } from "@/integrations/supabase/cmsSeo";
import { useToast } from "@/hooks/use-toast";

const SeoManager = () => {
  const { data, isLoading } = useHomeSeo();
  const { mutateAsync, isPending } = useUpsertHomeSeo();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? "");
      setDescription(data.meta_description ?? "");
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await mutateAsync({ title, meta_description: description });
      let auditFailed = false;
      try {
        await createAuditLog({ action: "Updated home SEO settings", section: "seo" });
      } catch { auditFailed = true; }
      toast({
        title: "SEO saved",
        description: auditFailed
          ? "Home page title and description have been updated. Audit logging failed."
          : "Home page title and description have been updated.",
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({ variant: "destructive", title: "Save failed", description: message });
    }
  };

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground/80">Home page SEO (slug=&quot;home&quot;)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-xs text-muted-foreground">Loading SEO settings...</p>}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground/70" htmlFor="seo-title">Page title</label>
          <Input id="seo-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Home page title" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground/70" htmlFor="seo-description">Meta description</label>
          <Textarea id="seo-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description shown in search results" />
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving..." : "Save SEO"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeoManager;
