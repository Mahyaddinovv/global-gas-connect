import {
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
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Blocks, FileSymlink, FileText, Globe2, Languages, LayoutDashboard, ListChecks, Users } from "lucide-react";
import { useAuth } from "@/integrations/supabase/auth";
import OverviewPanel from "./OverviewPanel";
import ContentManager from "./ContentManager";
import BuilderManager from "./BuilderManager";
import SeoManager from "./SeoManager";
import MenuManager from "./MenuManager";
import LanguagesManager from "./LanguagesManager";
import FormsManager from "./FormsManager";
import UsersManager from "./UsersManager";

type SectionKey = "overview" | "content" | "builder" | "menu" | "forms" | "seo" | "languages" | "users";

const sections: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "content", label: "Content", icon: FileText },
  { key: "builder", label: "Builder", icon: Blocks },
  { key: "menu", label: "Menu", icon: FileSymlink },
  { key: "forms", label: "Forms", icon: ListChecks },
  { key: "seo", label: "SEO", icon: Globe2 },
  { key: "languages", label: "Languages", icon: Languages },
  { key: "users", label: "Users", icon: Users },
];

const AdminDashboard = ({ initialSection = "overview" }: { initialSection?: SectionKey }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(initialSection);
  const { user, signOut } = useAuth();

  const ActiveIcon = sections.find((section) => section.key === activeSection)?.icon ?? LayoutDashboard;

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
              <span className="font-medium text-sidebar-foreground">{user?.email ?? "Unknown user"}</span>
              <span className="capitalize text-sidebar-foreground/70">{user?.role ?? "no role"}</span>
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
                  <span>{sections.find((section) => section.key === activeSection)?.label ?? "Overview"}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-400">Manage your ClearContent CMS configuration and content.</p>
              </div>
            </div>

            {activeSection === "overview" && <OverviewPanel />}
            {activeSection === "content" && <ContentManager />}
            {activeSection === "builder" && <BuilderManager />}
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

export default AdminDashboard;
