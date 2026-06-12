"use client";

/* eslint-disable @next/next/no-img-element */

import { useDeferredValue, useEffect, useState } from "react";
import { readImageDimensions } from "@/lib/browser-images";
import type { MemoryRecord } from "@/types/memory";

type AdminMemoryManagerProps = {
  initialMemories: MemoryRecord[];
};

function AdminMemoryCard({
  memory,
  onUpdated,
}: {
  memory: MemoryRecord;
  onUpdated: (memory: MemoryRecord) => void;
}) {
  const [name, setName] = useState(memory.name);
  const [nickname, setNickname] = useState(memory.nickname);
  const [department, setDepartment] = useState(memory.department);
  const [description, setDescription] = useState(memory.description);
  const [isVisible, setIsVisible] = useState(memory.isVisible);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = new FormData();
      payload.append("name", name);
      payload.append("nickname", nickname);
      payload.append("department", department);
      payload.append("description", description);
      payload.append("isVisible", String(isVisible));

      if (file) {
        const { width, height } = await readImageDimensions(file);
        payload.append("image", file);
        payload.append("imageWidth", String(width));
        payload.append("imageHeight", String(height));
      }

      const response = await fetch(`/api/admin/memories/${memory.id}`, {
        method: "PATCH",
        body: payload,
      });
      const result = (await response.json()) as {
        error?: string;
        memory?: MemoryRecord;
      };

      if (!response.ok || !result.memory) {
        throw new Error(result.error || "수정에 실패했어요.");
      }

      onUpdated(result.memory);
      setSuccessMessage("수정 내용을 저장했어요.");
      setFile(null);
      setPreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return null;
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "수정에 실패했어요.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="rounded-[28px] border border-sky-300/65 bg-white/88 p-4 shadow-[0_16px_28px_rgba(33,110,178,0.12)] sm:rounded-[32px] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-xl font-black tracking-[-0.05em] text-slate-950">
            {memory.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
              {memory.department || "부서 미입력"}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
              닉네임 {memory.nickname || memory.name}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                isVisible
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {isVisible ? "노출 중" : "숨김"}
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
              {new Date(memory.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-white/70 bg-sky-50 p-3 sm:h-[280px] sm:rounded-[24px] sm:p-4 lg:h-[320px]">
        <img
          src={previewUrl || memory.imageUrl}
          alt={name}
          className="max-h-full w-auto max-w-full object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="event-input h-[48px] rounded-[16px] px-4 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">닉네임</span>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="event-input h-[48px] rounded-[16px] px-4 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">부서</span>
          <input
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="event-input h-[48px] rounded-[16px] px-4 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">설명</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="event-input rounded-[16px] px-4 py-3 text-sm leading-6 text-slate-900 outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">이미지 교체</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              setFile(nextFile);
              setPreviewUrl((currentPreviewUrl) => {
                if (currentPreviewUrl) {
                  URL.revokeObjectURL(currentPreviewUrl);
                }

                return nextFile ? URL.createObjectURL(nextFile) : null;
              });
            }}
            className="event-input rounded-[16px] px-4 py-3 text-sm text-slate-700 file:mb-2 file:mr-0 file:block file:w-full file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2.5 file:text-sm file:font-black file:text-white sm:file:mb-0 sm:file:mr-3 sm:file:inline-flex sm:file:w-auto"
          />
        </label>

        <label className="flex items-start gap-3 rounded-[18px] border border-sky-200/80 bg-sky-50/70 px-4 py-3 text-sm font-black text-slate-900 sm:items-center">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(event) => setIsVisible(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-sky-300 text-sky-500 sm:mt-0"
          />
          전시 페이지와 공개 목록에 노출하기
        </label>

        {errorMessage ? (
          <div className="rounded-[18px] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="flex justify-stretch sm:justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="event-button-primary inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? "저장 중..." : "변경 저장"}
          </button>
        </div>
      </form>
    </article>
  );
}

export function AdminMemoryManager({
  initialMemories,
}: AdminMemoryManagerProps) {
  const [memories, setMemories] = useState(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const visibleCount = memories.filter((memory) => memory.isVisible).length;
  const hiddenCount = memories.length - visibleCount;
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredMemories =
    normalizedSearchQuery.length === 0
      ? memories
      : memories.filter((memory) =>
          memory.name.toLowerCase().includes(normalizedSearchQuery),
        );

  return (
    <section className="event-panel rounded-[32px] px-4 py-5 sm:rounded-[36px] sm:px-6 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black tracking-[0.08em] text-sky-700">
            관리자 페이지
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
            이미지와 정보 수정
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
            이름, 설명, 이미지와 공개 노출 여부를 이 화면에서 바로 수정할 수
            있어요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/85 px-3 py-2 text-xs font-black text-sky-950 shadow-[0_8px_20px_rgba(33,110,178,0.12)] sm:px-4 sm:text-sm">
            전체 {memories.length}건
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-700 sm:px-4 sm:text-sm">
            노출 {visibleCount}건
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-2 text-xs font-black text-slate-600 sm:px-4 sm:text-sm">
            숨김 {hiddenCount}건
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[24px] border border-sky-200/70 bg-white/75 p-3 sm:rounded-[28px] sm:p-4 lg:flex-row lg:items-center">
        <label className="w-full flex-1">
          <span className="sr-only">이름으로 검색</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="이름으로 검색"
            autoComplete="off"
            className="event-input h-[48px] w-full rounded-[16px] px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <span className="text-sm font-bold text-slate-600">
            검색 결과 {filteredMemories.length}건
          </span>
          {searchQuery.trim().length > 0 ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-sky-200 bg-white px-4 text-sm font-black text-sky-700 transition hover:-translate-y-0.5 sm:w-auto"
            >
              검색 초기화
            </button>
          ) : null}
        </div>
      </div>

      {filteredMemories.length === 0 ? (
        <div className="mt-5 rounded-[28px] border border-dashed border-sky-300/70 bg-white/82 px-6 py-12 text-center">
          <p className="text-2xl font-black tracking-[-0.05em] text-slate-950">
            검색 결과가 없습니다
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            다른 이름으로 검색하거나 검색어를 지우고 전체 목록을 확인해 주세요.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {filteredMemories.map((memory) => (
            <AdminMemoryCard
              key={`${memory.id}:${memory.updatedAt}`}
              memory={memory}
              onUpdated={(updatedMemory) => {
                setMemories((current) =>
                  current.map((item) =>
                    item.id === updatedMemory.id ? updatedMemory : item,
                  ),
                );
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
