import { ConfigurationNotice } from "@/components/configuration-notice";
import { EventSceneBackdrop } from "@/components/event-scene-backdrop";
import { MemoryGallery } from "@/components/memory-gallery";
import { getMissingServerEnv } from "@/lib/env";
import { listPublishedMemories } from "@/lib/firebase/memories";
import type { MemoryRecord } from "@/types/memory";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const missingEnvVars = getMissingServerEnv();
  let memories: MemoryRecord[] = [];
  let loadError: string | null = null;

  if (missingEnvVars.length === 0) {
    try {
      memories = await listPublishedMemories();
    } catch (error) {
      console.error("Failed to load memories", error);
      loadError =
        "추억 목록을 불러오지 못했어요. Firebase 설정이나 데이터베이스 권한을 확인해 주세요.";
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <EventSceneBackdrop />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {missingEnvVars.length > 0 ? (
          <ConfigurationNotice missingKeys={missingEnvVars} />
        ) : loadError ? (
          <div className="event-panel-strong rounded-[28px] px-5 py-4 text-sm text-rose-800">
            {loadError}
          </div>
        ) : (
          <MemoryGallery memories={memories} />
        )}
      </div>
    </main>
  );
}
