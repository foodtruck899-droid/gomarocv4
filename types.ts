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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_reference: string
          booking_status: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          gift_card_codes: string[] | null
          gift_card_discount: number | null
          id: string
          passenger_email: string | null
          passenger_name: string
          passenger_phone: string | null
          passport_number: string | null
          payment_status: string | null
          seat_numbers: number[] | null
          special_requests: string | null
          stripe_session_id: string | null
          total_price: number
          trip_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_reference: string
          booking_status?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          gift_card_codes?: string[] | null
          gift_card_discount?: number | null
          id?: string
          passenger_email?: string | null
          passenger_name: string
          passenger_phone?: string | null
          passport_number?: string | null
          payment_status?: string | null
          seat_numbers?: number[] | null
          special_requests?: string | null
          stripe_session_id?: string | null
          total_price: number
          trip_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_reference?: string
          booking_status?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          gift_card_codes?: string[] | null
          gift_card_discount?: number | null
          id?: string
          passenger_email?: string | null
          passenger_name?: string
          passenger_phone?: string | null
          passport_number?: string | null
          payment_status?: string | null
          seat_numbers?: number[] | null
          special_requests?: string | null
          stripe_session_id?: string | null
          total_price?: number
          trip_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          amenities: string[] | null
          brand: string | null
          capacity: number
          company_name: string | null
          created_at: string
          driver_phone: string | null
          id: string
          is_active: boolean | null
          model: string | null
          plate_number: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          brand?: string | null
          capacity: number
          company_name?: string | null
          created_at?: string
          driver_phone?: string | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          brand?: string | null
          capacity?: number
          company_name?: string | null
          created_at?: string
          driver_phone?: string | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          address: string | null
          code: string
          country: string | null
          created_at: string
          detailed_address: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: string | null
          phone: string | null
          postal_code: string | null
          region: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          country?: string | null
          created_at?: string
          detailed_address?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          country?: string | null
          created_at?: string
          detailed_address?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gift_card_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          gift_card_id: string
          id: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          gift_card_id: string
          id?: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          gift_card_id?: string
          id?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_card_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_card_transactions_gift_card_id_fkey"
            columns: ["gift_card_id"]
            isOneToOne: false
            referencedRelation: "gift_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_cards: {
        Row: {
          amount: number
          code: string
          created_at: string
          currency: string
          expires_at: string
          id: string
          initial_amount: number
          message: string | null
          payment_status: string | null
          purchaser_email: string | null
          purchaser_name: string | null
          recipient_email: string | null
          recipient_name: string | null
          redeemed_at: string | null
          redeemed_by_user_id: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          code: string
          created_at?: string
          currency?: string
          expires_at: string
          id?: string
          initial_amount: number
          message?: string | null
          payment_status?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          currency?: string
          expires_at?: string
          id?: string
          initial_amount?: number
          message?: string | null
          payment_status?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          arrival_time: string | null
          created_at: string
          departure_time: string | null
          destination_id: string
          duration_from_start: number | null
          id: string
          is_final_destination: boolean | null
          price_from_origin: number | null
          route_id: string
          stop_order: number
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          departure_time?: string | null
          destination_id: string
          duration_from_start?: number | null
          id?: string
          is_final_destination?: boolean | null
          price_from_origin?: number | null
          route_id: string
          stop_order: number
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          departure_time?: string | null
          destination_id?: string
          duration_from_start?: number | null
          id?: string
          is_final_destination?: boolean | null
          price_from_origin?: number | null
          route_id?: string
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          base_price: number
          created_at: string
          destination_id: string
          distance_km: number | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          origin_id: string
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          destination_id: string
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          origin_id: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          destination_id?: string
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          origin_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content_type: string
          created_at: string
          id: string
          key: string
          section: string
          updated_at: string
          value: string | null
        }
        Insert: {
          content_type?: string
          created_at?: string
          id?: string
          key: string
          section: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          key?: string
          section?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          arrival_time: string
          available_seats: number
          boarding_instructions: string | null
          bus_id: string
          created_at: string
          departure_time: string
          id: string
          price: number
          route_id: string
          special_notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          arrival_time: string
          available_seats: number
          boarding_instructions?: string | null
          bus_id: string
          created_at?: string
          departure_time: string
          id?: string
          price: number
          route_id: string
          special_notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          arrival_time?: string
          available_seats?: number
          boarding_instructions?: string | null
          bus_id?: string
          created_at?: string
          departure_time?: string
          id?: string
          price?: number
          route_id?: string
          special_notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      route_stops_detailed: {
        Row: {
          arrival_time: string | null
          created_at: string | null
          departure_time: string | null
          destination_address: string | null
          destination_code: string | null
          destination_id: string | null
          destination_name: string | null
          duration_from_start: number | null
          id: string | null
          is_final_destination: boolean | null
          price_from_origin: number | null
          route_id: string | null
          route_name: string | null
          stop_order: number | null
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_booking_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_gift_card_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_users_with_auth_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          email_confirmed_at: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }[]
      }
      increment_available_seats: {
        Args: { seats_to_add: number; trip_id: string }
        Returns: undefined
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
