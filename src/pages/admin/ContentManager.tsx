import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateAuditLog } from "@/integrations/supabase/cmsAudit";
import { CMS_LANGS, useCmsContentAll, useUpdateCmsContent, type CmsContentRow } from "@/integrations/supabase/cmsContent";
import { useToast } from "@/hooks/use-toast";
import type { Lang } from "@/i18n/translations";

const SECTION_ORDER: { id: string; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "offers", label: "Offers" },
  { id: "contact", label: "Contact" },
];

const ContentManager = () => {
  const [language, setLanguage] = useState<Lang>("EN");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    about: true,
    offers: true,
    contact: true,
  });
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const { data, isLoading, isError, error } = useCmsContentAll(language);
  const { mutateAsync: updateContent, isPending: isSaving } = useUpdateCmsContent();
  const { mutateAsync: createAuditLog } = useCreateAuditLog();
  const { toast } = useToast();

  const bySection = useMemo(() => {
    const grouped: Record<string, CmsContentRow[]> = {};
    for (const row of data ?? []) {
      if (!grouped[row.section]) grouped[row.section] = [];
      grouped[row.section].push(row);
    }
    return grouped;
  }, [data]);

  const handleToggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleChangeValue = (id: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (row: CmsContentRow) => {
    const newValue = editedValues[row.id] ?? row.value;
    if (newValue === row.value) return;

    try {
      await updateContent({ id: row.id, value: newValue });

      let auditFailed = false;
      try {
        await createAuditLog({
          action: `Updated ${row.section} content (${row.key}, ${language})`,
          section: "content",
        });
      } catch {
        auditFailed = true;
      }

      toast({
        title: "Saved",
        description: auditFailed
          ? `Updated "${row.key}" in ${row.section} (${language}). Audit logging failed.`
          : `Updated "${row.key}" in ${row.section} (${language}).`,
      });

      setEditedValues((prev) => {
        const { [row.id]: _removed, ...rest } = prev;
        return rest;
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Content sections</h2>
          <p className="text-xs text-muted-foreground">Edit hero, about, offers and contact texts for each language.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Language</span>
          <div className="flex gap-1">
            {CMS_LANGS.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={language === lang ? "default" : "ghost"}
                className={`h-7 px-2.5 text-xs ${
                  language === lang
                    ? ""
                    : "text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <Card className="border-border/60 bg-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Loading content from Supabase...</CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive">Error loading content</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-destructive/80">{(error as Error)?.message ?? "Unknown error"}</CardContent>
        </Card>
      )}

      {!isLoading &&
        !isError &&
        SECTION_ORDER.map((section) => {
          const rows = bySection[section.id] ?? [];

          return (
            <Card key={section.id} className="border-border/60 bg-card">
              <CardHeader
                className="flex cursor-pointer flex-row items-center justify-between space-y-0"
                onClick={() => handleToggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  {openSections[section.id] ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CardTitle className="text-sm font-medium text-foreground">{section.label}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">
                  {rows.length} key{rows.length === 1 ? "" : "s"}
                </span>
              </CardHeader>
              {openSections[section.id] && (
                <CardContent className="space-y-3">
                  {rows.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No rows found for this section and language. Create rows in the `cms_content` table with
                      section="{section.id}" and language="{language}".
                    </p>
                  )}
                  {rows.map((row) => {
                    const currentValue = editedValues[row.id] ?? row.value;
                    const dirty = currentValue !== row.value;

                    return (
                      <div
                        key={row.id}
                        className="flex flex-col gap-1 rounded-lg border border-border/40 bg-secondary/30 p-3 md:flex-row md:items-center md:gap-3"
                      >
                        <div className="w-full md:w-1/4">
                          <div className="text-xs font-mono text-foreground/80">{row.key}</div>
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                            {section.id} · {language}
                          </div>
                        </div>
                        <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:items-center">
                          <Input
                            value={currentValue}
                            onChange={(event) => handleChangeValue(row.id, event.target.value)}
                            className="w-full bg-background/50 text-sm"
                          />
                          <Button
                            size="sm"
                            className="md:w-28"
                            disabled={!dirty || isSaving}
                            onClick={() => void handleSave(row)}
                          >
                            {isSaving && dirty ? "Saving..." : dirty ? "Save" : "Saved"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
    </div>
  );
};

export default ContentManager;
