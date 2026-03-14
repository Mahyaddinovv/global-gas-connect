import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type CmsRole } from "@/integrations/supabase/auth";

interface CmsUserRow {
  id: string;
  email: string;
  role: CmsRole;
}

const roleOptions: CmsRole[] = ["superadmin", "admin", "editor"];

const UsersManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<CmsUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CmsRole>("editor");

  const isSuperadmin = user?.role === "superadmin";

  useEffect(() => {
    void loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cms_users").select("id, email, role").order("created_at", { ascending: true });
    if (error) {
      toast({ variant: "destructive", title: "Failed to load users", description: error.message });
      setLoading(false);
      return;
    }
    setUsers(
      (data ?? []).map((u) => ({ id: u.id, email: u.email, role: u.role as CmsRole })),
    );
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      const { error: authError } = await supabase.auth.admin.inviteUserByEmail(inviteEmail);
      if (authError) throw authError;

      const { error: insertError } = await (supabase.from("cms_users") as any).insert({ email: inviteEmail, role: inviteRole });
      if (insertError) throw insertError;

      setInviteEmail("");
      setInviteRole("editor");
      await loadUsers();
      toast({ title: "Invitation sent", description: `Invitation sent to ${inviteEmail}.` });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({ variant: "destructive", title: "Invite failed", description: message });
    }
  };

  const updateRole = async (id: string, role: CmsRole) => {
    const original = users;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    const { error } = await supabase.from("cms_users").update({ role }).eq("id", id);
    if (error) {
      setUsers(original);
      toast({ variant: "destructive", title: "Failed to update role", description: error.message });
    }
  };

  const removeUser = async (id: string) => {
    const userToRemove = users.find((u) => u.id === id);
    if (!userToRemove) return;
    const original = users;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    const { error } = await supabase.from("cms_users").delete().eq("id", id);
    if (error) {
      setUsers(original);
      toast({ variant: "destructive", title: "Failed to remove user", description: error.message });
    } else {
      toast({ title: "User removed", description: `${userToRemove.email} has been removed.` });
    }
  };

  if (!isSuperadmin) {
    return (
      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground/80">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            Only <span className="font-semibold">superadmin</span> users can manage CMS users.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground/80">Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-lg border border-border/40 bg-secondary/30 p-3">
          <div className="text-xs font-medium text-foreground/80">Invite new user</div>
          <div className="grid gap-2 md:grid-cols-[2fr_1fr_auto]">
            <Input type="email" placeholder="user@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as CmsRole)}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button onClick={() => void handleInvite()} disabled={!inviteEmail}>Invite</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-muted-foreground">Loading users…</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-2 rounded-lg border border-border/40 bg-secondary/30 p-3 text-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-medium text-foreground">{u.email}</div>
                  <div className="text-xs text-muted-foreground">Role: {u.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={u.role} onValueChange={(value) => void updateRole(u.id, value as CmsRole)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => void removeUser(u.id)}
                    disabled={u.id === user?.id}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManager;
