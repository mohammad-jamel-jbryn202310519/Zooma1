export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      package_features: {
        Row: {
          id: string
          title_ar: string
          title_en: string
          description_ar: string
          description_en: string
          icon: string | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title_ar: string
          title_en: string
          description_ar: string
          description_en: string
          icon?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title_ar?: string
          title_en?: string
          description_ar?: string
          description_en?: string
          icon?: string | null
          sort_order?: number | null
          created_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          client_name: string
          business_type: string
          image_url: string | null
          link_url: string | null
          description_ar: string | null
          description_en: string | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          business_type: string
          image_url?: string | null
          link_url?: string | null
          description_ar?: string | null
          description_en?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          business_type?: string
          image_url?: string | null
          link_url?: string | null
          description_ar?: string | null
          description_en?: string | null
          sort_order?: number | null
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          business_name: string | null
          quote_ar: string
          quote_en: string
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          business_name?: string | null
          quote_ar: string
          quote_en: string
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          business_name?: string | null
          quote_ar?: string
          quote_en?: string
          rating?: number | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          business_name: string | null
          business_type: string | null
          message: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          business_name?: string | null
          business_type?: string | null
          message?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          business_name?: string | null
          business_type?: string | null
          message?: string | null
          source?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}
