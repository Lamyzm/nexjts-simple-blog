/**
 * Supabase Database 타입 정의
 */

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string;
          name: string;
          instagram: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          instagram?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          instagram?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_images: {
        Row: {
          id: string;
          post_id: string;
          url: string;
          storage_path: string;
          blur_data_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          url: string;
          storage_path: string;
          blur_data_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          url?: string;
          storage_path?: string;
          blur_data_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          nickname: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          nickname: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          nickname?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 편의용 타입 alias
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type AuthorInsert = Database["public"]["Tables"]["authors"]["Insert"];

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

export type PostImage = Database["public"]["Tables"]["post_images"]["Row"];
export type PostImageInsert =
  Database["public"]["Tables"]["post_images"]["Insert"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

// 조인된 타입
export type PostWithAuthor = Post & {
  author: Author;
};

export type PostWithImages = Post & {
  images: PostImage[];
};

export type PostFull = Post & {
  author: Author;
  images: PostImage[];
};
