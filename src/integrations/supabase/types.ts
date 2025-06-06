export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      [_ in never]: never
    }
    Functions: {
      generate_voucher_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
