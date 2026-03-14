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
import { Blocks, FileSymlink, FileText, Globe2, Languages, LayoutDashboard, ListChecks, LogOut, Users } from "lucide-react";
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
    <div className="admin-theme">
      <SidebarProvider>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
          <SidebarHeader>
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">CG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">CoolGas</span>
                <span className="text-[11px] text-muted-foreground">CMS Admin</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/70 text-[11px] uppercase tracking-wider">Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <SidebarMenuItem key={section.key}>
                        <SidebarMenuButton
                          isActive={activeSection === section.key}
                          onClick={() => setActiveSection(section.key)}
                          className="transition-colors"
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
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/40 px-3 py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground/90">{user?.email ?? "Unknown user"}</span>
                <span className="text-[11px] capitalize text-muted-foreground">{user?.role ?? "no role"}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">Admin</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="capitalize text-muted-foreground">{activeSection}</span>
            </div>
          </header>
          <main className="flex-1 bg-background px-6 py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
                    <ActiveIcon className="h-5 w-5 text-primary" />
                    <span>{sections.find((section) => section.key === activeSection)?.label ?? "Overview"}</span>
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">Manage your CoolGas CMS configuration and content.</p>
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
    </div>
  );
};

export default AdminDashboard;
