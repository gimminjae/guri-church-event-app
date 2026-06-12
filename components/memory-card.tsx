/* eslint-disable @next/next/no-img-element */

import type { MemoryRecord } from "@/types/memory";

type MemoryCardProps = {
  memory: MemoryRecord;
  onSelect: (memory: MemoryRecord) => void;
};

const formatter = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
});

export function MemoryCard({ memory, onSelect }: MemoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(memory)}
      className="group relative overflow-hidden rounded-[30px] border border-sky-300/65 bg-white/88 p-3 text-left shadow-[0_16px_28px_rgba(33,110,178,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_34px_rgba(33,110,178,0.18)]"
    >
      <div className="absolute inset-x-6 top-2 h-20 rounded-full bg-sky-100/55 blur-2xl" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/70 bg-sky-50 p-3">
        <img
          src={memory.imageUrl}
          alt={memory.name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <div className="relative px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black tracking-[0.08em] text-sky-800">
              추억 기록
            </span>
            <p className="mt-3 truncate text-xl font-black tracking-[-0.05em] text-slate-950">
              {memory.name}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
              {memory.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-sky-700 shadow-[0_8px_16px_rgba(33,110,178,0.12)]">
            열기
          </span>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500">
          {formatter.format(memory.createdAt)}
        </p>
      </div>
    </button>
  );
}
