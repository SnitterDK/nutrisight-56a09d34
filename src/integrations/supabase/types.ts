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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beta_signups: {
        Row: {
          consent_contact: boolean
          consent_testimonial: boolean
          created_at: string
          email: string
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          selected_goal: string | null
          source_page: string | null
          status: Database["public"]["Enums"]["beta_status"]
        }
        Insert: {
          consent_contact?: boolean
          consent_testimonial?: boolean
          created_at?: string
          email: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          selected_goal?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["beta_status"]
        }
        Update: {
          consent_contact?: boolean
          consent_testimonial?: boolean
          created_at?: string
          email?: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          selected_goal?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["beta_status"]
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          feature_area: string | null
          feedback_text: string
          id: string
          rating: number | null
          testimonial_permission: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          feature_area?: string | null
          feedback_text: string
          id?: string
          rating?: number | null
          testimonial_permission?: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          feature_area?: string | null
          feedback_text?: string
          id?: string
          rating?: number | null
          testimonial_permission?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      gemini_logs: {
        Row: {
          anonymous_id: string | null
          created_at: string
          id: string
          input_type: string | null
          latency_ms: number | null
          model_used: string | null
          prompt_summary: string | null
          response_summary: string | null
          safety_flags: Json | null
          status: string
          token_usage: Json | null
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          id?: string
          input_type?: string | null
          latency_ms?: number | null
          model_used?: string | null
          prompt_summary?: string | null
          response_summary?: string | null
          safety_flags?: Json | null
          status?: string
          token_usage?: Json | null
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          id?: string
          input_type?: string | null
          latency_ms?: number | null
          model_used?: string | null
          prompt_summary?: string | null
          response_summary?: string | null
          safety_flags?: Json | null
          status?: string
          token_usage?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_key: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_key: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_key?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories_kcal: number
          carbs_g: number
          created_at: string
          eaten_at: string
          fiber_g: number
          food_name: string
          goal: string | null
          health_score: number | null
          id: string
          image_url: string | null
          protein_g: number
          recommendation: string | null
          salt_level: string | null
          scan_payload: Json | null
          sugar_g: number
          user_id: string
        }
        Insert: {
          calories_kcal?: number
          carbs_g?: number
          created_at?: string
          eaten_at?: string
          fiber_g?: number
          food_name: string
          goal?: string | null
          health_score?: number | null
          id?: string
          image_url?: string | null
          protein_g?: number
          recommendation?: string | null
          salt_level?: string | null
          scan_payload?: Json | null
          sugar_g?: number
          user_id: string
        }
        Update: {
          calories_kcal?: number
          carbs_g?: number
          created_at?: string
          eaten_at?: string
          fiber_g?: number
          food_name?: string
          goal?: string | null
          health_score?: number | null
          id?: string
          image_url?: string | null
          protein_g?: number
          recommendation?: string | null
          salt_level?: string | null
          scan_payload?: Json | null
          sugar_g?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_calorie_target: number
          daily_fiber_target_g: number
          daily_protein_target_g: number
          daily_sugar_target_g: number
          display_name: string | null
          id: string
          last_active_date: string | null
          onboarded: boolean
          primary_goal: string
          streak_days: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_calorie_target?: number
          daily_fiber_target_g?: number
          daily_protein_target_g?: number
          daily_sugar_target_g?: number
          display_name?: string | null
          id: string
          last_active_date?: string | null
          onboarded?: boolean
          primary_goal?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_calorie_target?: number
          daily_fiber_target_g?: number
          daily_protein_target_g?: number
          daily_sugar_target_g?: number
          display_name?: string | null
          id?: string
          last_active_date?: string | null
          onboarded?: boolean
          primary_goal?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      scan_events: {
        Row: {
          anonymous_id: string | null
          confidence: number | null
          created_at: string
          detected_food_items: Json | null
          estimated_calories: number | null
          estimated_carbs: number | null
          estimated_fiber: number | null
          estimated_protein: number | null
          estimated_salt: string | null
          estimated_sugar: number | null
          id: string
          input_type: string | null
          recommendation: string | null
          safety_disclaimer_shown: boolean
          selected_goal: string | null
          used_gemini: boolean
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          confidence?: number | null
          created_at?: string
          detected_food_items?: Json | null
          estimated_calories?: number | null
          estimated_carbs?: number | null
          estimated_fiber?: number | null
          estimated_protein?: number | null
          estimated_salt?: string | null
          estimated_sugar?: number | null
          id?: string
          input_type?: string | null
          recommendation?: string | null
          safety_disclaimer_shown?: boolean
          selected_goal?: string | null
          used_gemini?: boolean
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          confidence?: number | null
          created_at?: string
          detected_food_items?: Json | null
          estimated_calories?: number | null
          estimated_carbs?: number | null
          estimated_fiber?: number | null
          estimated_protein?: number | null
          estimated_salt?: string | null
          estimated_sugar?: number | null
          id?: string
          input_type?: string | null
          recommendation?: string | null
          safety_disclaimer_shown?: boolean
          selected_goal?: string | null
          used_gemini?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      beta_status: "new" | "contacted" | "tester" | "partner" | "archived"
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
    Enums: {
      app_role: ["admin", "user"],
      beta_status: ["new", "contacted", "tester", "partner", "archived"],
    },
  },
} as const
