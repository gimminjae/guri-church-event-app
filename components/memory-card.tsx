/* eslint-disable @next/next/no-img-element */

import { getPublicMemoryDisplayName } from "@/lib/memory-records";
import type { MemoryRecord } from "@/types/memory";

type MemoryCardProps = {
  memory: MemoryRecord;
  onSelect: (memory: MemoryRecord) => void;
};

const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function MemoryCard({ memory, onSelect }: MemoryCardProps) {
  const publicName = getPublicMemoryDisplayName(memory);

  return (
    <button
      type="button"
      onClick={() => onSelect(memory)}
      className="group flex flex-col overflow-hidden rounded-[28px] bg-white text-left shadow-[0_18px_34px_rgba(25,102,165,0.12)] ring-1 ring-sky-100/80 transition hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(25,102,165,0.18)] sm:h-[340px]"
    >
      <div className="relative h-1/2 overflow-hidden bg-[linear-gradient(135deg,#dfffb6_0%,#b6f132_46%,#92df15_100%)]">
        <img
          src={memory.imageUrl}
          alt={publicName}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.18))]" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-2xl font-black tracking-[-0.05em] text-slate-950">
            {publicName}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {formatter.format(memory.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}
