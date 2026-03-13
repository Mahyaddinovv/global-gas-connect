import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLogs, type CmsAuditSection } from "@/integrations/supabase/cmsAudit";
import { useNavigate } from "react-router-dom";

const sectionCards: { section: CmsAuditSection; title: string; label: string; href: string; description: string }[] = [
  { section: "content", title: "Content", label: "Content Manager", href: "/admin/content", description: "Hero, about, offers, and contact copy." },
  { section: "seo", title: "SEO", label: "SEO Settings", href: "/admin/seo", description: "Home page title and meta description." },
  { section: "menu", title: "Menu", label: "Menu Editor", href: "/admin/menu", description: "Navigation labels, order, and visibility." },
  { section: "forms", title: "Forms", label: "Form Builder", href: "/admin/forms", description: "Contact form field structure and labels." },
  { section: "languages", title: "Languages", label: "Language Manager", href: "/admin/languages", description: "Language switcher availability." },
  { section: "builder", title: "Builder", label: "Page Builder", href: "/admin/builder", description: "Homepage section order and visual styling." },
];

const formatDateTime = (value?: string) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const OverviewPanel = () => {
  const navigate = useNavigate();
  const { data: auditRows, isLoading, isError, error } = useAuditLogs();

  const recentActivity = (auditRows ?? []).slice(0, 10);
  const latestBySection = new Map<CmsAuditSection, string>();
  for (const row of auditRows ?? []) {
    if (!latestBySection.has(row.section)) {
      latestBySection.set(row.section, row.changed_at);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sectionCards.map((card) => (
          <Card
            key={card.section}
            role="button"
            tabIndex={0}
            onClick={() => navigate(card.href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(card.href);
              }
            }}
            className="cursor-pointer border-slate-800 bg-slate-900/70 transition-colors hover:border-sky-500/40 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-semibold text-slate-50">{card.label}</p>
              <p className="text-xs text-slate-400">{card.description}</p>
              <p className="text-xs text-slate-500">
                Last updated: <span className="text-slate-300">{formatDateTime(latestBySection.get(card.section))}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-slate-400">Loading activity...</p>}
          {isError && <p className="text-sm text-red-300">{(error as Error)?.message ?? "Failed to load audit logs."}</p>}
          {!isLoading && !isError && recentActivity.length === 0 && (
            <p className="text-sm text-slate-400">No audit activity recorded yet.</p>
          )}
          {!isLoading && !isError && recentActivity.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Who</TableHead>
                  <TableHead className="text-slate-400">What</TableHead>
                  <TableHead className="text-slate-400">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((row) => (
                  <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/20">
                    <TableCell className="text-slate-200">{row.user_email}</TableCell>
                    <TableCell className="text-slate-200">{row.action}</TableCell>
                    <TableCell className="text-slate-400">{formatDateTime(row.changed_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPanel;
