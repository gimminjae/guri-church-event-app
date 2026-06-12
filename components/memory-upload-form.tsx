"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_FILE_SIZE,
  MAX_NAME_LENGTH,
  validateCreateMemoryInput,
} from "@/lib/validations/memory";

type UploadStage =
  | "idle"
  | "uploading"
  | "saving"
  | "success";

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

function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지 정보를 읽지 못했어요."));
    };

    image.src = objectUrl;
  });
}

export function MemoryUploadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
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
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-5"
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-900">이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={MAX_NAME_LENGTH}
            disabled={isBusy}
            placeholder="예: 청년부 민지"
            className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-900">설명</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={MAX_DESCRIPTION_LENGTH}
            disabled={isBusy}
            rows={5}
            placeholder="사진에 담긴 순간이나 마음을 자유롭게 적어 주세요."
            className="rounded-md border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
          <p className="text-right text-xs text-stone-500">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-900">이미지</span>
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
            className="block w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          <p className="text-xs text-stone-500">
            최대 {Math.floor(MAX_IMAGE_FILE_SIZE / (1024 * 1024))}MB, JPG/PNG/WEBP
          </p>
        </label>

        <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
          <div className="flex min-h-[260px] items-center justify-center p-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="선택한 이미지 미리보기"
                className="max-h-[420px] w-full rounded-md object-cover"
              />
            ) : (
              <p className="text-sm text-stone-500">
                선택한 이미지 미리보기
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-900">업로드 상태</p>
              <p className="mt-1 text-xs text-stone-600">
                {stage === "idle" && "등록 준비 완료"}
                {stage === "uploading" && "서버가 AWS SDK로 S3 업로드를 준비하는 중"}
                {stage === "saving" && "S3 업로드 후 추억 정보를 저장하는 중"}
                {stage === "success" && "완료! 리스트로 이동합니다"}
              </p>
            </div>
            <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-stone-700">
              {progress}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-stone-700 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            리스트 보기
          </Link>
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex h-11 items-center justify-center rounded-md bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {isBusy ? "업로드 진행 중..." : "추억 등록하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
