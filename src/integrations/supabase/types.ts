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
      shipment_orders: {
        Row: {
          created_at: string
          id: string
          lines_count: number
          order_code: string
          qty: number
          receiver_name: string
          route_code: string | null
          shipment_id: string
          volume: number
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          lines_count?: number
          order_code: string
          qty?: number
          receiver_name: string
          route_code?: string | null
          shipment_id: string
          volume?: number
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          lines_count?: number
          order_code?: string
          qty?: number
          receiver_name?: string
          route_code?: string | null
          shipment_id?: string
          volume?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipment_orders_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          code: string
          created_at: string
          driver_name: string | null
          driver_phone: string | null
          has_transport: boolean
          id: string
          notified_at: string | null
          partner_confirmed_at: string | null
          partner_email: string | null
          partner_name: string | null
          partner_note: string | null
          partner_phone: string | null
          partner_token: string | null
          planned_at: string | null
          plate_no: string | null
          receiver_name: string
          route_code: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          total_volume: number
          total_weight: number
          updated_at: string
          vehicle_capacity_kg: number | null
          vehicle_type: string | null
        }
        Insert: {
          code: string
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          has_transport?: boolean
          id?: string
          notified_at?: string | null
          partner_confirmed_at?: string | null
          partner_email?: string | null
          partner_name?: string | null
          partner_note?: string | null
          partner_phone?: string | null
          partner_token?: string | null
          planned_at?: string | null
          plate_no?: string | null
          receiver_name: string
          route_code?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          total_volume?: number
          total_weight?: number
          updated_at?: string
          vehicle_capacity_kg?: number | null
          vehicle_type?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          has_transport?: boolean
          id?: string
          notified_at?: string | null
          partner_confirmed_at?: string | null
          partner_email?: string | null
          partner_name?: string | null
          partner_note?: string | null
          partner_phone?: string | null
          partner_token?: string | null
          planned_at?: string | null
          plate_no?: string | null
          receiver_name?: string
          route_code?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          total_volume?: number
          total_weight?: number
          updated_at?: string
          vehicle_capacity_kg?: number | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_shipment_by_token: {
        Args: { _note?: string; _token: string }
        Returns: boolean
      }
      get_shipment_by_token: {
        Args: { _token: string }
        Returns: {
          code: string
          driver_name: string
          driver_phone: string
          id: string
          orders: Json
          partner_confirmed_at: string
          partner_name: string
          partner_note: string
          planned_at: string
          plate_no: string
          receiver_name: string
          route_code: string
          status: Database["public"]["Enums"]["shipment_status"]
          total_volume: number
          total_weight: number
          vehicle_type: string
        }[]
      }
    }
    Enums: {
      shipment_status:
        | "draft"
        | "approved"
        | "notified"
        | "partner_confirmed"
        | "in_transit"
        | "delivered"
        | "cancelled"
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
      shipment_status: [
        "draft",
        "approved",
        "notified",
        "partner_confirmed",
        "in_transit",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
