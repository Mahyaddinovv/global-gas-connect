export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cms_audit: {
        Row: {
          action: string | null
          changed_at: string | null
          id: string
          section: string | null
          user_email: string | null
        }
        Insert: {
          action?: string | null
          changed_at?: string | null
          id?: string
          section?: string | null
          user_email?: string | null
        }
        Update: {
          action?: string | null
          changed_at?: string | null
          id?: string
          section?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
      cms_blocks: {
        Row: {
          alignment: string
          bg_type: string
          bg_value: string
          id: string
          order: number
          padding: number
          section: string
          updated_at: string | null
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          alignment?: string
          bg_type?: string
          bg_value?: string
          id?: string
          order?: number
          padding?: number
          section: string
          updated_at?: string | null
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          alignment?: string
          bg_type?: string
          bg_value?: string
          id?: string
          order?: number
          padding?: number
          section?: string
          updated_at?: string | null
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          id: string
          key: string
          language: string | null
          section: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          language?: string | null
          section: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          language?: string | null
          section?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "cms_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_forms: {
        Row: {
          field_key: string
          id: string
          label: string | null
          language: string
          placeholder: string | null
          position: number
          required: boolean
        }
        Insert: {
          field_key: string
          id?: string
          label?: string | null
          language: string
          placeholder?: string | null
          position: number
          required?: boolean
        }
        Update: {
          field_key?: string
          id?: string
          label?: string | null
          language?: string
          placeholder?: string | null
          position?: number
          required?: boolean
        }
        Relationships: []
      }
      cms_languages: {
        Row: {
          code: string
          enabled: boolean
          id: string
        }
        Insert: {
          code: string
          enabled?: boolean
          id?: string
        }
        Update: {
          code?: string
          enabled?: boolean
          id?: string
        }
        Relationships: []
      }
      cms_menu: {
        Row: {
          id: string
          key: string
          label: string
          language: string
          position: number
          visible: boolean
        }
        Insert: {
          id?: string
          key: string
          label: string
          language: string
          position: number
          visible?: boolean
        }
        Update: {
          id?: string
          key?: string
          label?: string
          language?: string
          position?: number
          visible?: boolean
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          id: string
          language: string
          meta_description: string | null
          slug: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          language?: string
          meta_description?: string | null
          slug: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          language?: string
          meta_description?: string | null
          slug?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company_name: string
          consent: boolean
          contact_person: string
          created_at: string | null
          email: string
          id: string
          language: string | null
          message: string
          source: string | null
          team_slug: string | null
        }
        Insert: {
          company_name: string
          consent: boolean
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          language?: string | null
          message: string
          source?: string | null
          team_slug?: string | null
        }
        Update: {
          company_name?: string
          consent?: boolean
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          language?: string | null
          message?: string
          source?: string | null
          team_slug?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
