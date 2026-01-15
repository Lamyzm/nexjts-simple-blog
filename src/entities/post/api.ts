import { createClient } from "@/lib/supabase/client";

import type { PostFull, PostWithAuthor } from "./model";

export async function getPosts(): Promise<PostWithAuthor[]> {
  const supabase = createClient();
  const { data, error } = (await supabase
    .from("posts")
    .select(
      `
      *,
      author:authors(*)
    `
    )
    .order("created_at", { ascending: false })) as {
    data: PostWithAuthor[] | null;
    error: Error | null;
  };

  if (error) throw error;
  return data ?? [];
}

export async function getPostsByAuthor(
  authorId: string
): Promise<PostWithAuthor[]> {
  const supabase = createClient();
  const { data, error } = (await supabase
    .from("posts")
    .select(
      `
      *,
      author:authors(*)
    `
    )
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })) as {
    data: PostWithAuthor[] | null;
    error: Error | null;
  };

  if (error) throw error;
  return data ?? [];
}

export async function getPostById(id: string): Promise<PostFull | null> {
  const supabase = createClient();
  const { data, error } = (await supabase
    .from("posts")
    .select(
      `
      *,
      author:authors(*),
      images:post_images(*)
    `
    )
    .eq("id", id)
    .single()) as {
    data: PostFull | null;
    error: { code: string; message: string } | null;
  };

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  // 이미지를 order_index 순으로 정렬
  if (data?.images) {
    data.images.sort((a, b) => a.order_index - b.order_index);
  }

  return data;
}

export async function getPostsGroupedByAuthor(): Promise<
  Array<{
    author: PostWithAuthor["author"];
    posts: PostWithAuthor[];
  }>
> {
  const posts = await getPosts();

  // 작성자별로 그룹화
  const grouped = posts.reduce(
    (acc, post) => {
      const authorId = post.author.id;
      if (!acc[authorId]) {
        acc[authorId] = {
          author: post.author,
          posts: [],
        };
      }
      acc[authorId].posts.push(post);
      return acc;
    },
    {} as Record<
      string,
      { author: PostWithAuthor["author"]; posts: PostWithAuthor[] }
    >
  );

  return Object.values(grouped);
}
