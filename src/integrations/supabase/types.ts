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
      announcements: {
        Row: {
          active: boolean
          body: string
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      confessions: {
        Row: {
          body: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      game_rounds: {
        Row: {
          correct_answer: string | null
          ends_at: string
          finished: boolean
          id: string
          prompt: Json
          question_id: string | null
          room_id: string
          round_number: number
          started_at: string
        }
        Insert: {
          correct_answer?: string | null
          ends_at: string
          finished?: boolean
          id?: string
          prompt: Json
          question_id?: string | null
          room_id: string
          round_number: number
          started_at?: string
        }
        Update: {
          correct_answer?: string | null
          ends_at?: string
          finished?: boolean
          id?: string
          prompt?: Json
          question_id?: string | null
          room_id?: string
          round_number?: number
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["notif_kind"]
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["notif_kind"]
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["notif_kind"]
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          games_played: number
          id: string
          points: number
          updated_at: string
          username: string
          wins: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          games_played?: number
          id: string
          points?: number
          updated_at?: string
          username: string
          wins?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          games_played?: number
          id?: string
          points?: number
          updated_at?: string
          username?: string
          wins?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          body: string
          correct: string
          created_at: string
          created_by: string | null
          difficulty: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          subject: string
        }
        Insert: {
          body: string
          correct: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          subject: string
        }
        Update: {
          body?: string
          correct?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          subject?: string
        }
        Relationships: []
      }
      room_players: {
        Row: {
          id: string
          is_eliminated: boolean
          joined_at: string
          room_id: string
          score: number
          user_id: string
        }
        Insert: {
          id?: string
          is_eliminated?: boolean
          joined_at?: string
          room_id: string
          score?: number
          user_id: string
        }
        Update: {
          id?: string
          is_eliminated?: boolean
          joined_at?: string
          room_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          code: string
          created_at: string
          current_round: number
          finished_at: string | null
          game_key: string
          host_id: string
          id: string
          is_public: boolean
          name: string
          round_seconds: number
          started_at: string | null
          status: Database["public"]["Enums"]["room_status"]
          subjects: string[] | null
          total_rounds: number
        }
        Insert: {
          code: string
          created_at?: string
          current_round?: number
          finished_at?: string | null
          game_key: string
          host_id: string
          id?: string
          is_public?: boolean
          name: string
          round_seconds?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          subjects?: string[] | null
          total_rounds?: number
        }
        Update: {
          code?: string
          created_at?: string
          current_round?: number
          finished_at?: string | null
          game_key?: string
          host_id?: string
          id?: string
          is_public?: boolean
          name?: string
          round_seconds?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          subjects?: string[] | null
          total_rounds?: number
        }
        Relationships: []
      }
      round_answers: {
        Row: {
          answer: string
          answered_at: string
          id: string
          is_correct: boolean
          points: number
          round_id: string
          user_id: string
        }
        Insert: {
          answer: string
          answered_at?: string
          id?: string
          is_correct?: boolean
          points?: number
          round_id: string
          user_id: string
        }
        Update: {
          answer?: string
          answered_at?: string
          id?: string
          is_correct?: boolean
          points?: number
          round_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_answers_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "game_rounds"
            referencedColumns: ["id"]
          },
        ]
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
      confessions_public: {
        Row: {
          body: string | null
          created_at: string | null
          id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      gen_room_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_room_host: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_member: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      notif_kind: "announcement" | "room_invite" | "game_result" | "system"
      room_status: "waiting" | "in_progress" | "finished"
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
      notif_kind: ["announcement", "room_invite", "game_result", "system"],
      room_status: ["waiting", "in_progress", "finished"],
    },
  },
} as const
