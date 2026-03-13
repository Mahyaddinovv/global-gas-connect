import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useHomeSeo, useUpsertHomeSeo } from "@/integrations/supabase/cmsSeo";
import { useToast } from "@/hooks/use-toast";

const SeoManager = () => {
  const { data, isLoading } = useHomeSeo();
  const { mutateAsync, isPending } = useUpsertHomeSeo();
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
      toast({
        title: "SEO saved",
        description: "Home page title and description have been updated.",
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
        <CardTitle className="text-sm font-medium text-slate-100">
          Home page SEO (slug=&quot;home&quot;)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-xs text-slate-400">Loading SEO settings…</p>}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-200" htmlFor="seo-title">
            Page title
          </label>
          <Input
            id="seo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Home page title"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-200" htmlFor="seo-description">
            Meta description
          </label>
          <Textarea
            id="seo-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown in search results"
          />
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving…" : "Save SEO"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeoManager;

