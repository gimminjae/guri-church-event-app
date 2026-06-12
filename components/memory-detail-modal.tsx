"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useEffectEvent } from "react";
import { EVENT_COPY } from "@/lib/event";
import { getPublicMemoryDisplayName } from "@/lib/memory-records";
import type { MemoryRecord } from "@/types/memory";

type MemoryDetailModalProps = {
  memory: MemoryRecord | null;
  onClose: () => void;
};

const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function MemoryDetailModal({
  memory,
  onClose,
}: MemoryDetailModalProps) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  });

  useEffect(() => {
    if (!memory) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      onKeyDown(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [memory]);

  if (!memory) {
    return null;
  }

  const publicName = getPublicMemoryDisplayName(memory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-sky-950/28 px-3 py-4 backdrop-blur-md sm:items-center sm:px-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="event-panel-strong max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[34px]">
        <div className="flex items-center justify-between gap-3 border-b border-sky-200/70 px-5 py-4 sm:px-6">
          <div>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">
              {publicName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="event-button-secondary inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-black text-sky-950 transition hover:-translate-y-0.5"
          >
            닫기
          </button>
        </div>

        <div className="grid max-h-[calc(92vh-86px)] overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
          <div className="bg-white/28 p-4 sm:p-5">
            <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[26px] border border-white/70 bg-white/70 p-4 shadow-[0_16px_28px_rgba(33,110,178,0.12)]">
              <img
                src={memory.imageUrl}
                alt={publicName}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
            <div className="rounded-[24px] border border-sky-200/75 bg-white/80 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                등록일
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {formatter.format(memory.createdAt)}
              </p>
            </div>

            <div className="rounded-[24px] border border-sky-200/75 bg-white/80 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                설명
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base">
                {memory.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
