import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import {
  DEFAULT_FORM_FIELDS,
  useFormConfig,
  useUpsertFormFields,
  type CmsFormFieldRow,
} from "@/integrations/supabase/cmsForms";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface EditableField {
  id: string;
  field_key: string;
  label: string;
  placeholder: string;
  required: boolean;
  position: number;
}

const FormsManager = () => {
  const { lang } = useLanguage();
  const { data, isLoading } = useFormConfig();
  const { mutateAsync, isPending } = useUpsertFormFields();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const [fields, setFields] = useState<EditableField[]>([]);

  useEffect(() => {
    const existingByKey: Record<string, CmsFormFieldRow> = {};
    for (const row of data ?? []) {
      existingByKey[row.field_key] = row;
    }

    const merged: EditableField[] = DEFAULT_FORM_FIELDS.map((def, index) => {
      const existing = existingByKey[def.key];
      return {
        id: existing?.id ?? crypto.randomUUID(),
        field_key: def.key,
        label: existing?.label ?? defaultLabel(def.key),
        placeholder: existing?.placeholder ?? "",
        required: existing?.required ?? defaultRequired(def.key),
        position: existing?.position ?? index,
      };
    }).sort((a, b) => a.position - b.position);

    setFields(merged);
  }, [data]);

  const moveField = (idx: number, direction: -1 | 1) => {
    setFields((prev) => {
      const next = [...prev];
      const targetIndex = idx + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const [item] = next.splice(idx, 1);
      next.splice(targetIndex, 0, item);
      return next.map((field, index) => ({ ...field, position: index }));
    });
  };

  const updateField = (id: string, patch: Partial<EditableField>) => {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  };

  const handleSave = async () => {
    try {
      const payload: CmsFormFieldRow[] = fields.map((field) => ({
        id: field.id,
        field_key: field.field_key,
        label: field.label,
        placeholder: field.placeholder,
        required: field.required,
        position: field.position,
        language: lang.toLowerCase(),
      }));

      await mutateAsync(payload);

      let auditFailed = false;
      try {
        await createAuditLog({ action: `Updated contact form settings (${lang})`, section: "forms" });
      } catch { auditFailed = true; }

      toast({
        title: "Form saved",
        description: auditFailed
          ? "Contact form configuration has been updated. Audit logging failed."
          : "Contact form configuration has been updated.",
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({ variant: "destructive", title: "Save failed", description: message });
    }
  };

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground/80">Contact form fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-xs text-muted-foreground">Loading form configuration...</p>}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 rounded-lg border border-border/40 bg-secondary/30 p-3 text-sm md:flex-row md:items-center"
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">{field.field_key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60">Required</span>
                    <Switch checked={field.required} onCheckedChange={(value) => updateField(field.id, { required: value === true })} />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveField(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} placeholder="Label" />
                  <Input value={field.placeholder} onChange={(event) => updateField(field.id, { placeholder: event.target.value })} placeholder="Placeholder" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={() => void handleSave()} disabled={isPending}>
          {isPending ? "Saving..." : "Save form"}
        </Button>
      </CardContent>
    </Card>
  );
};

const defaultLabel = (key: string) => {
  switch (key) {
    case "company": return "Company Name";
    case "contactPerson": return "Contact Person";
    case "email": return "Email";
    case "message": return "Message";
    case "consent": return "Consent";
    default: return key;
  }
};

const defaultRequired = (key: string) => key !== "consent";

export default FormsManager;
