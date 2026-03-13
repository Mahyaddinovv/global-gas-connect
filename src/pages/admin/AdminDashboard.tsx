import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { FileText, FileSymlink, Globe2, Languages, LayoutDashboard, ListChecks, Users } from "lucide-react";
import { useAuth } from "@/integrations/supabase/auth";
import ContentManager from "./ContentManager";
import SeoManager from "./SeoManager";
import MenuManager from "./MenuManager";
import LanguagesManager from "./LanguagesManager";
import FormsManager from "./FormsManager";
import UsersManager from "./UsersManager";

type SectionKey = "overview" | "content" | "menu" | "forms" | "seo" | "languages" | "users";

const sections: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "content", label: "Content", icon: FileText },
  { key: "menu", label: "Menu", icon: FileSymlink },
  { key: "forms", label: "Forms", icon: ListChecks },
  { key: "seo", label: "SEO", icon: Globe2 },
  { key: "languages", label: "Languages", icon: Languages },
  { key: "users", label: "Users", icon: Users },
];

const AdminDashboard = ({ initialSection = "overview" }: { initialSection?: SectionKey }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(initialSection);
  const { user, signOut } = useAuth();

  const ActiveIcon = sections.find((s) => s.key === activeSection)?.icon ?? LayoutDashboard;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <span className="text-sm font-semibold">CC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-50">ClearContent</span>
              <span className="text-xs text-slate-400">CMS Admin</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <SidebarMenuItem key={section.key}>
                      <SidebarMenuButton
                        isActive={activeSection === section.key}
                        onClick={() => setActiveSection(section.key)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between rounded-md bg-sidebar-accent/50 px-2 py-2 text-xs">
            <div className="flex flex-col">
              <span className="font-medium text-sidebar-foreground">
                {user?.email ?? "Unknown user"}
              </span>
              <span className="capitalize text-sidebar-foreground/70">
                {user?.role ?? "no role"}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Admin</span>
            <span className="text-muted-foreground">/</span>
            <span className="capitalize text-muted-foreground">{activeSection}</span>
          </div>
        </header>
        <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-6 text-slate-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <ActiveIcon className="h-5 w-5 text-sky-400" />
                  <span>
                    {sections.find((s) => s.key === activeSection)?.label ?? "Overview"}
                  </span>
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your ClearContent CMS configuration and content.
                </p>
              </div>
            </div>

            {activeSection === "overview" && (
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-800 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-300">
                      Content model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-3xl font-semibold text-slate-50">cms_content</p>
                    <p className="text-xs text-slate-400">
                      Key-value content sections per language.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-300">
                      SEO pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-3xl font-semibold text-slate-50">cms_pages</p>
                    <p className="text-xs text-slate-400">
                      Slugs, titles and meta descriptions.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-300">
                      User roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">superadmin</span> – full access
                    </p>
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">admin</span> – content + users
                    </p>
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">editor</span> – content only
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "content" && <ContentManager />}

            {activeSection === "menu" && <MenuManager />}

            {activeSection === "forms" && <FormsManager />}

            {activeSection === "seo" && <SeoManager />}

            {activeSection === "languages" && <LanguagesManager />}

            {activeSection === "users" && <UsersManager />}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const SectionPlaceholder = ({ title, description }: { title: string; description: string }) => (
  <Card className="border-dashed border-slate-800 bg-slate-900/50">
    <CardHeader>
      <CardTitle className="text-base font-medium text-slate-100">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-slate-300">
      <p>{description}</p>
      <p className="text-xs text-slate-500">
        This is a placeholder section ready to be wired to your Supabase tables and queries.
      </p>
    </CardContent>
  </Card>
);

export default AdminDashboard;

