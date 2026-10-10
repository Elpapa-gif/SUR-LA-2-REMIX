export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string;
          avatar_url: string | null;
          role: 'admin' | 'moderator' | 'member';
          title: string;
          mood_type: string;
          mood_emoji: string;
          mood_label: string;
          mood_color: string;
          mood_custom_status: string | null;
          mood_updated_at: string;
          streak_days: number;
          last_active_at: string;
          xp: number;
          level: number;
          coins: number;
          equipped_badge: string | null;
          badges: string[];
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'moderator' | 'member';
          title?: string;
          mood_type?: string;
          mood_emoji?: string;
          mood_label?: string;
          mood_color?: string;
          mood_custom_status?: string | null;
          streak_days?: number;
          xp?: number;
          level?: number;
          coins?: number;
          equipped_badge?: string | null;
          badges?: string[];
          bio?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          name: string;
          type: 'channel' | 'direct';
          topic: string | null;
          avatar: string | null;
          is_pinned: boolean;
          category: 'salons' | 'groupes' | 'directs';
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'channel' | 'direct';
          topic?: string | null;
          avatar?: string | null;
          is_pinned?: boolean;
          category?: 'salons' | 'groupes' | 'directs';
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          sender_name: string;
          sender_avatar: string | null;
          sender_role: string;
          content: string;
          message_type: 'text' | 'image' | 'quiz' | 'system' | 'voice';
          quiz_id: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          sender_name: string;
          sender_avatar?: string | null;
          sender_role?: string;
          content: string;
          message_type?: 'text' | 'image' | 'quiz' | 'system' | 'voice';
          quiz_id?: string | null;
          image_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          category: string;
          description: string | null;
          time_limit_sec: number;
          xp_reward: number;
          coins_reward: number;
          created_by_user_id: string | null;
          created_by_name: string;
          participants_count: number;
          created_at: string;
        };
      };
    };
  };
}
