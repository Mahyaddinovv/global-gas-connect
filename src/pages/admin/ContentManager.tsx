import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CMS_LANGS, useCmsContentAll, type CmsContentRow, useUpdateCmsContent } from "@/integrations/supabase/cmsContent";
import type { Lang } from "@/i18n/translations";
import { useToast } from "@/hooks/use-toast";

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
      toast({
        title: "Saved",
        description: `Updated "${row.key}" in ${row.section} (${language}).`,
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
          <h2 className="text-lg font-semibold text-slate-50">Content sections</h2>
          <p className="text-xs text-slate-400">
            Edit hero, about, offers and contact texts for each language.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1">
          <span className="text-xs text-slate-400">Language</span>
          <div className="flex gap-1">
            {CMS_LANGS.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={language === lang ? "default" : "ghost"}
                className={`h-7 px-2 text-xs ${
                  language === lang
                    ? "bg-sky-500 text-slate-900 hover:bg-sky-400"
                    : "text-slate-200 hover:text-slate-50"
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
        <Card className="border-slate-800 bg-slate-900/60">
          <CardContent className="py-10 text-center text-sm text-slate-400">
            Loading content from Supabase...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-red-900/60 bg-red-950/40">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-100">Error loading content</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-red-200">
            {(error as Error)?.message ?? "Unknown error"}
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        !isError &&
        SECTION_ORDER.map((section) => {
          const rows = bySection[section.id] ?? [];

          return (
            <Card key={section.id} className="border-slate-700/80 bg-slate-900/80 text-slate-100 shadow-sm">
              <CardHeader
                className="flex cursor-pointer flex-row items-center justify-between space-y-0"
                onClick={() => handleToggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  {openSections[section.id] ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                  <CardTitle className="text-sm font-medium text-slate-100">
                    {section.label}
                  </CardTitle>
                </div>
                <span className="text-xs text-slate-400">
                  {rows.length} key{rows.length === 1 ? "" : "s"}
                </span>
              </CardHeader>
              {openSections[section.id] && (
                <CardContent className="space-y-3">
                  {rows.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No rows found for this section and language. Create rows in the
                      `cms_content` table with section="{section.id}" and language="{language}".
                    </p>
                  )}
                  {rows.map((row) => {
                    const currentValue = editedValues[row.id] ?? row.value;
                    const dirty = currentValue !== row.value;

                    return (
                      <div
                        key={row.id}
                        className="flex flex-col gap-1 rounded-md border border-slate-800/80 bg-slate-950/80 p-3 md:flex-row md:items-center md:gap-3"
                      >
                        <div className="w-full md:w-1/4">
                          <div className="text-xs font-mono text-slate-200">{row.key}</div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-500">
                            {section.id} · {language}
                          </div>
                        </div>
                        <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:items-center">
                          <Input
                            value={currentValue}
                            onChange={(e) => handleChangeValue(row.id, e.target.value)}
                            className="w-full bg-slate-950/80 text-sm"
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

