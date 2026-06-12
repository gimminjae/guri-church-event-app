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
      className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-left transition hover:border-stone-300 hover:shadow-sm"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={memory.imageUrl}
          alt={memory.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-stone-900">
            {memory.name}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {formatter.format(memory.createdAt)}
          </p>
        </div>
        <span className="shrink-0 text-xs text-stone-500">
          자세히
        </span>
      </div>
    </button>
  );
}
