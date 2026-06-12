"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readImageDimensions } from "@/lib/browser-images";
import { EVENT_COPY } from "@/lib/event";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_DEPARTMENT_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_FILE_SIZE,
  MAX_NAME_LENGTH,
  MAX_NICKNAME_LENGTH,
  validateCreateMemoryInput,
} from "@/lib/validations/memory";

type UploadStage = "idle" | "uploading" | "saving" | "success";

function getApiErrorMessage(payload: unknown, fallbackMessage: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallbackMessage;
}

function getStageLabel(stage: UploadStage) {
  switch (stage) {
    case "uploading":
      return "사진을 업로드하는 중";
    case "saving":
      return "응모 내용을 저장하는 중";
    case "success":
      return "완료! 전시관으로 이동합니다";
    default:
      return "사진과 설명을 입력하면 바로 응모돼요";
  }
}

export function MemoryUploadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [nicknameSameAsName, setNicknameSameAsName] = useState(true);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isBusy = stage !== "idle";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setErrorMessage("이미지 파일을 먼저 선택해 주세요.");
      return;
    }

    setErrorMessage(null);
    setProgress(0);

    try {
      const { width, height } = await readImageDimensions(file);

      validateCreateMemoryInput({
        name,
        nickname,
        department,
        description,
        imageUrl: "https://placeholder.local",
        imageKey: "memories/placeholder",
        imageWidth: width,
        imageHeight: height,
      });

      setStage("uploading");
      setProgress(35);

      setStage("saving");
      setProgress(70);

      const payload = new FormData();
      payload.append("name", name);
      payload.append("nickname", nickname);
      payload.append("department", department);
      payload.append("description", description);
      payload.append("image", file);
      payload.append("imageWidth", String(width));
      payload.append("imageHeight", String(height));

      const saveResponse = await fetch("/api/memories", {
        method: "POST",
        body: payload,
      });

      const savePayload = (await saveResponse.json()) as { error?: string };

      if (!saveResponse.ok) {
        throw new Error(
          getApiErrorMessage(savePayload, "추억 저장에 실패했어요."),
        );
      }

      setStage("success");
      setProgress(100);

      startTransition(() => {
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      setStage("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했어요.",
      );
    }
  }

  return (
    <section className="event-panel rounded-[36px] px-5 py-5 sm:px-6 sm:py-6">
      <div className="event-panel-strong rounded-[28px] px-5 py-5">
        <p className="text-xs font-black tracking-[0.08em] text-sky-700">
          {EVENT_COPY.entryLabel} 참여 안내
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950">
          사진과 짧은 설명을 함께 올려주세요
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {EVENT_COPY.uploadGuide} 정성껏 남겨 주신 추억은 전시관에서 모두가
          함께 볼 수 있어요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">
            이름
          </span>
          <input
            value={name}
            onChange={(event) => {
              const nextName = event.target.value;
              setName(nextName);

              if (nicknameSameAsName) {
                setNickname(nextName);
              }
            }}
            maxLength={MAX_NAME_LENGTH}
            disabled={isBusy}
            placeholder="예: 김민재"
            className="event-input h-[52px] rounded-[18px] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
          />
        </label>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-slate-900">닉네임</span>
            <label className="inline-flex items-center gap-2 text-xs font-black text-sky-700">
              <input
                type="checkbox"
                checked={nicknameSameAsName}
                disabled={isBusy}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setNicknameSameAsName(checked);

                  if (checked) {
                    setNickname(name);
                  }
                }}
                className="h-4 w-4 rounded border-sky-300 text-sky-500"
              />
              이름과 동일
            </label>
          </div>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={MAX_NICKNAME_LENGTH}
            disabled={isBusy || nicknameSameAsName}
            placeholder="예: 민재"
            className="event-input h-[52px] rounded-[18px] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:opacity-70"
          />
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">부서</span>
          <input
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            maxLength={MAX_DEPARTMENT_LENGTH}
            disabled={isBusy}
            placeholder="예: 청년부"
            className="event-input h-[52px] rounded-[18px] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">
            사진 설명
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={MAX_DESCRIPTION_LENGTH}
            disabled={isBusy}
            rows={5}
            placeholder="이 장면이 왜 기억에 남았는지, 어떤 마음이었는지 자유롭게 적어 주세요."
            className="event-input rounded-[18px] px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400"
          />
          <p className="text-right text-xs font-bold text-slate-500">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-slate-900">사진 업로드</span>
          <div className="event-input rounded-[22px] px-4 py-4">
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              disabled={isBusy}
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setErrorMessage(null);
                setFile(nextFile);
                setPreviewUrl((currentPreviewUrl) => {
                  if (currentPreviewUrl) {
                    URL.revokeObjectURL(currentPreviewUrl);
                  }

                  return nextFile ? URL.createObjectURL(nextFile) : null;
                });
              }}
              className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2.5 file:text-sm file:font-black file:text-white"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
              <span>
                최대 {Math.floor(MAX_IMAGE_FILE_SIZE / (1024 * 1024))}MB
              </span>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700">
                JPG / PNG / WEBP
              </span>
              {file ? (
                <span className="rounded-full bg-white px-2.5 py-1 text-slate-700">
                  {file.name}
                </span>
              ) : null}
            </div>
          </div>
        </label>

        <div className="event-panel-strong overflow-hidden rounded-[28px] p-4">
          <div className="flex min-h-[280px] items-center justify-center rounded-[22px] border border-dashed border-sky-300/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(225,248,255,0.85))] p-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="선택한 이미지 미리보기"
                className="max-h-[420px] w-full rounded-[18px] object-cover shadow-[0_16px_30px_rgba(33,110,178,0.14)]"
              />
            ) : (
              <div className="text-center">
                <p className="text-lg font-black tracking-[-0.04em] text-slate-800">
                  선택한 사진 미리보기
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  하계수양회에서 기억에 남는 한 장을 골라 주세요.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="event-panel-strong rounded-[28px] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">업로드 상태</p>
              <p className="mt-1 text-xs font-bold text-slate-600">
                {getStageLabel(stage)}
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-sky-700 shadow-[0_8px_16px_rgba(33,110,178,0.1)]">
              {progress}%
            </span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/85">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#57d5ff,#2ba8ff)] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/"
            className="event-button-secondary inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-black text-sky-950 transition hover:-translate-y-0.5"
          >
            전시관 보기
          </Link>
          <button
            type="submit"
            disabled={isBusy}
            className="event-button-primary inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "응모 진행 중..." : "응모 2 등록하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
