import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import { MENU_KEYS, useMenu, useUpsertMenuItems, type CmsMenuItemRow } from "@/integrations/supabase/cmsMenu";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface EditableMenuItem {
  id: string;
  key: string;
  label: string;
  position: number;
  visible: boolean;
}

const MenuManager = () => {
  const { lang } = useLanguage();
  const { data, isLoading } = useMenu();
  const { mutateAsync, isPending } = useUpsertMenuItems();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const [items, setItems] = useState<EditableMenuItem[]>([]);

  useEffect(() => {
    const existingByKey: Record<string, CmsMenuItemRow> = {};
    for (const row of data ?? []) {
      existingByKey[row.key] = row;
    }

    const merged: EditableMenuItem[] = MENU_KEYS.map((def, index) => {
      const existing = existingByKey[def.key];
      return {
        id: existing?.id ?? crypto.randomUUID(),
        key: def.key,
        label: existing?.label ?? labelFromKey(def.key),
        position: existing?.position ?? index,
        visible: existing?.visible ?? true,
      };
    }).sort((a, b) => a.position - b.position);

    setItems(merged);
  }, [data]);

  const moveItem = (idx: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const targetIndex = idx + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const [item] = next.splice(idx, 1);
      next.splice(targetIndex, 0, item);
      return next.map((entry, index) => ({ ...entry, position: index }));
    });
  };

  const toggleVisible = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
  };

  const updateLabel = (id: string, label: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const handleSave = async () => {
    try {
      const payload: CmsMenuItemRow[] = items.map((item) => ({
        id: item.id,
        key: item.key,
        label: item.label,
        position: item.position,
        visible: item.visible,
        language: lang.toLowerCase(),
      }));

      await mutateAsync(payload);

      let auditFailed = false;
      try {
        await createAuditLog({
          action: `Updated menu settings (${lang})`,
          section: "menu",
        });
      } catch {
        auditFailed = true;
      }

      toast({
        title: "Menu saved",
        description: auditFailed
          ? "Navigation labels and order have been updated. Audit logging failed."
          : "Navigation labels and order have been updated.",
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
        <CardTitle className="text-sm font-medium text-slate-100">Main navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-xs text-slate-400">Loading menu...</p>}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-sm"
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{item.key}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => toggleVisible(item.id)}
                    >
                      {item.visible ? <Eye className="h-4 w-4 text-sky-400" /> : <EyeOff className="h-4 w-4 text-slate-500" />}
                    </Button>
                  </div>
                </div>
                <Input
                  value={item.label}
                  onChange={(event) => updateLabel(item.id, event.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving..." : "Save menu"}
        </Button>
      </CardContent>
    </Card>
  );
};

const labelFromKey = (key: string) => {
  switch (key) {
    case "about":
      return "About";
    case "offers":
      return "What We Offer";
    case "contact":
      return "Contact";
    default:
      return key;
  }
};

export default MenuManager;
