"use client";

import Link from "next/link";
import { useState } from "react";
import { MemoryCard } from "@/components/memory-card";
import { MemoryDetailModal } from "@/components/memory-detail-modal";
import type { MemoryRecord } from "@/types/memory";

type MemoryGalleryProps = {
  memories: MemoryRecord[];
};

export function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<MemoryRecord | null>(
    null,
  );

  return (
    <>
      <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-3xl">
            추억 리스트
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            등록된 사진을 눌러 이름과 설명을 자세히 볼 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">
            총 {memories.length}개
          </span>
          <Link
            href="/upload"
            className="inline-flex rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            업로드하기
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {memories.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 px-6 text-center">
            <h2 className="text-xl font-semibold text-stone-900">
              아직 등록된 추억이 없습니다
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              첫 번째 추억을 업로드해 보세요.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              업로드하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onSelect={setSelectedMemory}
              />
            ))}
          </div>
        )}
      </section>

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </>
  );
}
