import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CmsRole = "superadmin" | "admin" | "editor";

interface CmsUser {
  id: string;
  email: string;
  role: CmsRole;
}

interface AuthContextValue {
  user: CmsUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadCmsUser(session.user.email ?? undefined);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void loadCmsUser(session.user.email ?? undefined);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadCmsUser = async (email?: string) => {
    if (!email) {
      setUser(null);
      return;
    }

    const { data, error } = await supabase
      .from("cms_users")
      .select("id, email, role")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      // If the mapping fails, still keep the auth session but without role
      // so UI can show a friendly message.
      // eslint-disable-next-line no-console
      console.error("Failed to load cms_users record:", error);
      setUser(null);
      return;
    }

    if (!data) {
      setUser(null);
      return;
    }

    setUser({
      id: data.id,
      email: data.email,
      role: data.role as CmsRole,
    });
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      const sessionEmail = data.user?.email ?? email;
      await loadCmsUser(sessionEmail);

      return {};
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

