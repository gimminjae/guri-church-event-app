import "server-only";

import { randomUUID } from "node:crypto";
import { getServerEnv } from "@/lib/env";
import type { CreateMemoryInput, MemoryRecord } from "@/types/memory";

const MEMORIES_PATH = "memories";

function getMemoriesEndpoint() {
  const env = getServerEnv();
  return `${env.firebaseDatabaseUrl.replace(/\/+$/, "")}/${MEMORIES_PATH}`;
}

async function readDatabase<T>(path = "") {
  const response = await fetch(`${getMemoriesEndpoint()}${path}.json`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Firebase Realtime Database 조회에 실패했어요.");
  }

  return (await response.json()) as T;
}

async function writeDatabase<T>(path: string, payload: T) {
  const response = await fetch(`${getMemoriesEndpoint()}${path}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Firebase Realtime Database 저장에 실패했어요.");
  }
}

function normalizeMemoryRecord(
  id: string,
  record: Partial<MemoryRecord>,
): MemoryRecord | null {
  if (
    typeof record.name !== "string" ||
    typeof record.description !== "string" ||
    typeof record.imageUrl !== "string" ||
    typeof record.imageKey !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: record.name,
    description: record.description,
    imageUrl: record.imageUrl,
    imageKey: record.imageKey,
    imageWidth:
      typeof record.imageWidth === "number" ? record.imageWidth : undefined,
    imageHeight:
      typeof record.imageHeight === "number" ? record.imageHeight : undefined,
    createdAt:
      typeof record.createdAt === "number" ? record.createdAt : Date.now(),
    updatedAt:
      typeof record.updatedAt === "number" ? record.updatedAt : Date.now(),
    status: record.status === "published" ? "published" : "published",
    thumbnailUrl:
      typeof record.thumbnailUrl === "string" ? record.thumbnailUrl : undefined,
    eventId: typeof record.eventId === "string" ? record.eventId : undefined,
    authorId: typeof record.authorId === "string" ? record.authorId : undefined,
    isDeleted: record.isDeleted === true,
    sortOrder: typeof record.sortOrder === "number" ? record.sortOrder : null,
  };
}

export async function listPublishedMemories(limit = 120) {
  const rawValue = await readDatabase<
    Record<string, Partial<MemoryRecord>> | null
  >();

  if (!rawValue) {
    return [];
  }

  return Object.entries(rawValue)
    .map(([id, record]) => normalizeMemoryRecord(id, record))
    .filter((memory): memory is MemoryRecord => memory !== null)
    .filter((memory) => memory.status === "published" && !memory.isDeleted)
    .sort((first, second) => second.createdAt - first.createdAt)
    .slice(0, limit);
}

export async function createMemory(input: CreateMemoryInput) {
  const memoryId = randomUUID();

  const timestamp = Date.now();

  const memory: MemoryRecord = {
    id: memoryId,
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    imageKey: input.imageKey,
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "published",
    ...(typeof input.imageWidth === "number"
      ? { imageWidth: input.imageWidth }
      : {}),
    ...(typeof input.imageHeight === "number"
      ? { imageHeight: input.imageHeight }
      : {}),
  };

  await writeDatabase(`/${memoryId}`, memory);

  return memory;
}
