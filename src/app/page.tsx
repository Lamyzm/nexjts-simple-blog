import type { Metadata } from "next";

import { YouTubeEmbed } from "@next/third-parties/google";

import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Home | We walk neary",
  description: "sandvill's Youtube Channel",
};

// ISR: 40초마다 재검증
export const revalidate = 40;

type YouTubeVideo = {
  id: string;
  video_id: string;
  title: string | null;
  order_index: number;
};

export default async function HomePage() {
  const supabase = await createServerClient();

  const { data: videos } = (await supabase
    .from("youtube_videos")
    .select("*")
    .order("order_index", { ascending: true })) as {
    data: YouTubeVideo[] | null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1450px] mx-auto p-4 sm:p-8">
        {/* YouTube Video Section */}
        <section className="mb-12">
          <div className="mx-auto space-y-8 gap-6 grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))]">
            {(videos ?? []).length === 0 ? (
              <p className="py-20 text-center text-muted-foreground font-sans">
                등록된 영상이 없습니다.
              </p>
            ) : (
              (videos ?? []).map((video, index) => (
                <div key={video.id + `-${index}`}>
                  <div className="rounded-lg overflow-hidden bg-zinc-900">
                    <YouTubeEmbed
                      videoid={video.video_id}
                      style="width: 100%; aspect-ratio: 16/9;"
                    />
                  </div>
                  {video.title && (
                    <p className="mt-3 text-sm font-sans text-zinc-400 text-start">
                      {video.title}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
