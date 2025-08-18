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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_analytics: {
        Row: {
          created_at: string
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric_date?: string
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login_at: string | null
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name: string
          password_hash: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          branch: string
          created_at: string
          date: string
          duration: number
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          status: string
          time: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          branch: string
          created_at?: string
          date: string
          duration: number
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          status?: string
          time: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          branch?: string
          created_at?: string
          date?: string
          duration?: number
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          time?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      gift_vouchers: {
        Row: {
          amount: number
          branch: string
          created_at: string
          expires_at: string
          id: string
          message: string | null
          payment_status: string
          recipient_name: string
          recipient_phone: string
          sender_name: string
          status: string
          voucher_code: string
        }
        Insert: {
          amount: number
          branch: string
          created_at?: string
          expires_at?: string
          id?: string
          message?: string | null
          payment_status?: string
          recipient_name: string
          recipient_phone: string
          sender_name: string
          status?: string
          voucher_code: string
        }
        Update: {
          amount?: number
          branch?: string
          created_at?: string
          expires_at?: string
          id?: string
          message?: string | null
          payment_status?: string
          recipient_name?: string
          recipient_phone?: string
          sender_name?: string
          status?: string
          voucher_code?: string
        }
        Relationships: []
      }
      mpesa_transactions: {
        Row: {
          amount: number | null
          checkout_request_id: string
          created_at: string
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          payment_reference: string | null
          phone_number: string | null
          reference_id: string | null
          result_code: number | null
          result_desc: string | null
          status: string
          transaction_date: string | null
          transaction_type: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          checkout_request_id: string
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_reference?: string | null
          phone_number?: string | null
          reference_id?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          transaction_type?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          checkout_request_id?: string
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_reference?: string | null
          phone_number?: string | null
          reference_id?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          transaction_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string
          id: string
          payment_method: string
          reference_id: string
          status: string
          transaction_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method: string
          reference_id: string
          status?: string
          transaction_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string
          reference_id?: string
          status?: string
          transaction_id?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      booking_analytics: {
        Row: {
          avg_booking_value: number | null
          cancelled_bookings: number | null
          confirmed_bookings: number | null
          date: string | null
          pending_bookings: number | null
          total_bookings: number | null
          total_revenue: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      branch_performance: {
        Row: {
          avg_booking_value: number | null
          booking_percentage: number | null
          branch: string | null
          total_bookings: number | null
          total_revenue: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      daily_performance: {
        Row: {
          avg_booking_value: number | null
          booking_count: number | null
          date: string | null
          day_of_week: number | null
          revenue: number | null
        }
        Relationships: []
      }
      monthly_revenue_trends: {
        Row: {
          avg_booking_value: number | null
          bookings_count: number | null
          month: string | null
          revenue: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      service_duration_analytics: {
        Row: {
          avg_revenue_per_booking: number | null
          booking_count: number | null
          duration: number | null
          percentage: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      authenticate_admin: {
        Args: { email_input: string; password_input: string }
        Returns: {
          admin_id: string
          email: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["admin_role"]
        }[]
      }
      create_admin_session: {
        Args: { admin_id_input: string }
        Returns: string
      }
      create_admin_user: {
        Args: {
          email_input: string
          name_input: string
          password_input: string
          role_input: Database["public"]["Enums"]["admin_role"]
        }
        Returns: string
      }
      generate_voucher_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_analytics_summary: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_booking_value: number
          cancelled_bookings: number
          confirmed_bookings: number
          growth_rate: number
          pending_bookings: number
          total_bookings: number
          total_revenue: number
          unique_customers: number
        }[]
      }
      is_active_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
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
      admin_role: ["super_admin", "admin", "moderator"],
    },
  },
} as const
