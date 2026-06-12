import { AdminMemoryManager } from "@/components/admin-memory-manager";
import { ConfigurationNotice } from "@/components/configuration-notice";
import { EventSceneBackdrop } from "@/components/event-scene-backdrop";
import { getMissingServerEnv } from "@/lib/env";
import { listAllMemories } from "@/lib/firebase/memories";
import type { MemoryRecord } from "@/types/memory";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const missingEnvVars = getMissingServerEnv();
  let memories: MemoryRecord[] = [];
  let loadError: string | null = null;

  if (missingEnvVars.length === 0) {
    try {
      memories = await listAllMemories(500);
    } catch (error) {
      console.error("Failed to load admin memories", error);
      loadError = "관리자 데이터를 불러오지 못했어요.";
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
          <AdminMemoryManager initialMemories={memories} />
        )}
      </div>
    </main>
  );
}
