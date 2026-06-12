"use client";

import Link from "next/link";
import { useState } from "react";
import { MemoryCard } from "@/components/memory-card";
import { MemoryDetailModal } from "@/components/memory-detail-modal";
import { EVENT_COPY } from "@/lib/event";
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
      <section
        id="memory-gallery"
        className="event-panel rounded-[36px] px-5 py-6 sm:px-6 sm:py-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
              등록된 사진을 눌러 그날의 이야기까지 함께 읽어보세요.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-black text-sky-950 shadow-[0_8px_20px_rgba(33,110,178,0.12)]">
              총 {memories.length}개
            </span>
            <Link
              href="/upload"
              className="event-button-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              사진 올리기
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-[32px] border border-white/55 bg-white/28 p-4 sm:p-5">
          {memories.length === 0 ? (
            <div className="event-panel-strong flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-sky-300/70 px-6 text-center">
              <h3 className="text-2xl font-black tracking-[-0.05em] text-slate-950">
                아직 등록된 추억이 없습니다
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-700 sm:text-base">
                첫 번째 사진과 설명을 남겨서 하계수양회 응모 2 전시관을 함께
                채워 주세요.
              </p>
              <Link
                href="/upload"
                className="event-button-primary mt-5 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                첫 추억 올리기
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onSelect={setSelectedMemory}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </>
  );
}
