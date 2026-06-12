import { onValue, ref } from "firebase/database";
import { getFirebaseClientDatabase } from "@/lib/firebase/client";
import {
  isPublicMemory,
  normalizeMemoryRecord,
  sortMemoriesByCreatedAtDesc,
} from "@/lib/memory-records";
import type { MemoryRecord } from "@/types/memory";

function normalizeSnapshot(
  rawValue: Record<string, Partial<MemoryRecord>> | null,
) {
  if (!rawValue) {
    return [];
  }

  return Object.entries(rawValue)
    .map(([id, record]) => normalizeMemoryRecord(id, record))
    .filter((memory): memory is MemoryRecord => memory !== null)
    .filter((memory) => isPublicMemory(memory))
    .sort(sortMemoriesByCreatedAtDesc);
}

export function subscribeToPublishedMemories(
  onChange: (memories: MemoryRecord[]) => void,
  onError: (error: Error) => void,
) {
  let database;

  try {
    database = getFirebaseClientDatabase();
  } catch (error) {
    queueMicrotask(() => {
      onError(
        error instanceof Error
          ? error
          : new Error("실시간 연결에 실패했어요."),
      );
    });

    return () => {};
  }

  const memoriesRef = ref(database, "memories");

  return onValue(
    memoriesRef,
    (snapshot) => {
      const memories = normalizeSnapshot(
        snapshot.val() as Record<string, Partial<MemoryRecord>> | null,
      );
      onChange(memories);
    },
    (error) => {
      onError(error instanceof Error ? error : new Error("실시간 연결에 실패했어요."));
    },
  );
}
