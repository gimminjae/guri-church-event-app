import { ConfigurationNotice } from "@/components/configuration-notice";
import { MemoryGallery } from "@/components/memory-gallery";
import { getMissingServerEnv } from "@/lib/env";
import { listPublishedMemories } from "@/lib/firebase/memories";
import type { MemoryRecord } from "@/types/memory";

export const dynamic = "force-dynamic";

export default async function Home() {
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
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        {missingEnvVars.length > 0 ? (
          <ConfigurationNotice missingKeys={missingEnvVars} />
        ) : null}
        {loadError ? (
          <div className="rounded-[28px] border border-amber-950/10 bg-amber-100/80 px-5 py-4 text-sm text-amber-950 shadow-[0_10px_30px_rgba(146,64,14,0.08)] backdrop-blur">
            {loadError}
          </div>
        ) : null}
        <MemoryGallery memories={memories} />
      </div>
    </main>
  );
}
