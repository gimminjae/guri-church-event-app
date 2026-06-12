import "server-only";

import { randomUUID } from "node:crypto";
import { getServerEnv } from "@/lib/env";
import {
  isManageableMemory,
  isPublicMemory,
  normalizeMemoryRecord,
  sortMemoriesByCreatedAtDesc,
} from "@/lib/memory-records";
import type {
  CreateMemoryInput,
  MemoryRecord,
  UpdateMemoryInput,
} from "@/types/memory";

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

async function patchDatabase<T>(path: string, payload: T) {
  const response = await fetch(`${getMemoriesEndpoint()}${path}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Firebase Realtime Database 수정에 실패했어요.");
  }
}

export async function getMemoryById(id: string) {
  const rawValue = await readDatabase<Partial<MemoryRecord> | null>(`/${id}`);

  if (!rawValue) {
    return null;
  }

  return normalizeMemoryRecord(id, rawValue);
}

export async function listAllMemories(limit = 500) {
  const rawValue = await readDatabase<
    Record<string, Partial<MemoryRecord>> | null
  >();

  if (!rawValue) {
    return [];
  }

  return Object.entries(rawValue)
    .map(([id, record]) => normalizeMemoryRecord(id, record))
    .filter((memory): memory is MemoryRecord => memory !== null)
    .filter((memory) => isManageableMemory(memory))
    .sort(sortMemoriesByCreatedAtDesc)
    .slice(0, limit);
}

export async function listPublishedMemories(limit = 120) {
  const memories = await listAllMemories(limit * 2);

  return memories.filter((memory) => isPublicMemory(memory)).slice(0, limit);
}

export async function createMemory(input: CreateMemoryInput) {
  const memoryId = randomUUID();

  const timestamp = Date.now();

  const memory: MemoryRecord = {
    id: memoryId,
    name: input.name,
    nickname: input.nickname,
    department: input.department,
    description: input.description,
    imageUrl: input.imageUrl,
    imageKey: input.imageKey,
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "published",
    isVisible: input.isVisible !== false,
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

export async function updateMemory(id: string, input: UpdateMemoryInput) {
  const existingMemory = await getMemoryById(id);

  if (!existingMemory) {
    throw new Error("수정할 데이터를 찾지 못했어요.");
  }

  const nextMemory: MemoryRecord = {
    ...existingMemory,
    name: input.name,
    nickname: input.nickname,
    department: input.department,
    description: input.description,
    isVisible: input.isVisible,
    updatedAt: Date.now(),
    ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
    ...(input.imageKey ? { imageKey: input.imageKey } : {}),
    ...(typeof input.imageWidth === "number"
      ? { imageWidth: input.imageWidth }
      : {}),
    ...(typeof input.imageHeight === "number"
      ? { imageHeight: input.imageHeight }
      : {}),
  };

  await patchDatabase(`/${id}`, nextMemory);

  return nextMemory;
}
