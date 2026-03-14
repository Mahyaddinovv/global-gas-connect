import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import {
  mergeBlocks,
  useBlocks,
  useUpsertBlocks,
  type CmsBlockAlignment,
  type CmsBlockBackgroundType,
  type CmsBlockRow,
  type CmsBlockSection,
} from "@/integrations/supabase/cmsBlocks";
import { useToast } from "@/hooks/use-toast";

const blockTitles: Record<CmsBlockSection, string> = {
  hero: "Hero",
  about: "About",
  offers: "What We Offer",
  contact: "Contact",
};

const alignmentOptions: CmsBlockAlignment[] = ["left", "center", "right"];
const backgroundTypes: CmsBlockBackgroundType[] = ["solid", "gradient"];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const supabaseError = error as { message?: string; details?: string; hint?: string; code?: string };
    return supabaseError.message ?? supabaseError.details ?? supabaseError.hint ?? supabaseError.code ?? "Unknown error";
  }
  return "Unknown error";
};

const BuilderManager = () => {
  const { data, isLoading } = useBlocks();
  const { mutateAsync, isPending } = useUpsertBlocks();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const [blocks, setBlocks] = useState<CmsBlockRow[]>([]);
  const [draggingSection, setDraggingSection] = useState<CmsBlockSection | null>(null);

  useEffect(() => {
    setBlocks(mergeBlocks(data));
  }, [data]);

  const reorderBlocks = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [block] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, block);
      return next.map((item, index) => ({ ...item, order: index }));
    });
  };

  const updateBlock = (id: string, patch: Partial<CmsBlockRow>) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  };

  const handleDrop = (targetSection: CmsBlockSection) => {
    if (!draggingSection || draggingSection === targetSection) {
      setDraggingSection(null);
      return;
    }
    const fromIndex = blocks.findIndex((block) => block.section === draggingSection);
    const toIndex = blocks.findIndex((block) => block.section === targetSection);
    reorderBlocks(fromIndex, toIndex);
    setDraggingSection(null);
  };

  const handleSave = async () => {
    try {
      await mutateAsync(blocks.map((block, index) => ({ ...block, order: index })));
      let auditFailed = false;
      try {
        await createAuditLog({ action: "Updated visual page builder settings", section: "builder" });
      } catch { auditFailed = true; }
      toast({
        title: "Builder saved",
        description: auditFailed
          ? "Page block order and styling have been updated. Audit logging failed."
          : "Page block order and styling have been updated.",
      });
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Save failed", description: getErrorMessage(e) });
    }
  };

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground/80">Visual page builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLoading && (!data || data.length === 0) && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-foreground">
            If save says <code>cms_blocks</code> is missing, apply the new Supabase migration first and then refresh this page.
          </div>
        )}
        {isLoading && <p className="text-xs text-muted-foreground">Loading builder blocks...</p>}
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={block.section}
              draggable
              onDragStart={() => setDraggingSection(block.section)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(block.section)}
              onDragEnd={() => setDraggingSection(null)}
              className="rounded-xl border border-border/40 bg-secondary/30 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-border/40 p-2 text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{blockTitles[block.section]}</div>
                    <div className="text-xs text-muted-foreground">{block.section}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => reorderBlocks(index, index - 1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => reorderBlocks(index, index + 1)} disabled={index === blocks.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateBlock(block.id, { visible: !block.visible })}>
                    {block.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground/70">Visible</label>
                  <div className="flex h-10 items-center rounded-md border border-border/40 bg-background/50 px-3">
                    <Switch checked={block.visible} onCheckedChange={(value) => updateBlock(block.id, { visible: value === true })} />
                    <span className="ml-3 text-sm text-foreground/70">
                      {block.visible ? "Shown on public page" : "Hidden from public page"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground/70">Background type</label>
                  <Select value={block.bg_type} onValueChange={(value) => updateBlock(block.id, { bg_type: value as CmsBlockBackgroundType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {backgroundTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground/70">Alignment</label>
                  <Select value={block.alignment} onValueChange={(value) => updateBlock(block.id, { alignment: value as CmsBlockAlignment })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {alignmentOptions.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground/70">Padding top / bottom</label>
                  <Input type="number" min={0} step={8} value={block.padding} onChange={(event) => updateBlock(block.id, { padding: Math.max(0, Number(event.target.value) || 0) })} />
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-foreground/70">
                  {block.bg_type === "gradient" ? "Gradient value" : "Solid background value"}
                </label>
                <Input
                  value={block.bg_value}
                  onChange={(event) => updateBlock(block.id, { bg_value: event.target.value })}
                  placeholder={block.bg_type === "gradient" ? "linear-gradient(135deg, #0f4c81, #2db5c0)" : "#ffffff or hsl(var(--background))"}
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving..." : "Save builder"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuilderManager;
