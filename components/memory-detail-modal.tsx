"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useEffectEvent } from "react";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">
              {memory.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            닫기
          </button>
        </div>

        <div className="grid max-h-[calc(92vh-84px)] overflow-y-auto sm:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-stone-50 p-4 sm:p-5">
            <div className="overflow-hidden rounded-lg bg-stone-100">
              <img
                src={memory.imageUrl}
                alt={memory.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
            <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
              <p className="text-xs font-medium text-stone-500">
                등록일
              </p>
              <p className="mt-2 text-base text-stone-900">
                {formatter.format(memory.createdAt)}
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
              <p className="text-xs font-medium text-stone-500">
                설명
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">
                {memory.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
