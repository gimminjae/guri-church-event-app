import Link from "next/link";
import { ConfigurationNotice } from "@/components/configuration-notice";
import { EventSceneBackdrop } from "@/components/event-scene-backdrop";
import { MemoryUploadForm } from "@/components/memory-upload-form";
import { getMissingServerEnv } from "@/lib/env";
import { EVENT_COPY } from "@/lib/event";

export const dynamic = "force-dynamic";

export default function UploadPage() {
  const missingEnvVars = getMissingServerEnv();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <EventSceneBackdrop />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <section className="event-panel rounded-[36px] px-5 py-7 text-center sm:px-7">
          <p className="event-outline-kicker text-4xl sm:text-5xl">
            {EVENT_COPY.entryLabel}
          </p>
          <h1 className="event-outline-title mt-3 text-[3rem] leading-[0.94] sm:text-[4.5rem]">
            추억 업로드
          </h1>
          <p className="mt-5 text-lg font-black tracking-[-0.04em] text-slate-900 sm:text-2xl">
            {EVENT_COPY.entryTitle}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            사진과 짧은 설명을 남기면 응모가 완료되고, 전시관에도 바로
            반영됩니다.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="event-panel-strong rounded-[26px] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                기간
              </p>
              <p className="mt-2 text-sm font-black text-slate-900">
                {EVENT_COPY.eventPeriod}
              </p>
            </div>
            <div className="event-panel-strong rounded-[26px] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                준비물
              </p>
              <p className="mt-2 text-sm font-black text-slate-900">
                사진 1장 + 짧은 설명
              </p>
            </div>
            <div className="event-panel-strong rounded-[26px] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                발표
              </p>
              <p className="mt-2 text-sm font-black text-slate-900">
                {EVENT_COPY.announcementDate}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/"
              className="event-button-secondary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-black text-sky-950 transition hover:-translate-y-0.5"
            >
              전시관으로 돌아가기
            </Link>
          </div>
        </section>

        {missingEnvVars.length > 0 ? (
          <ConfigurationNotice missingKeys={missingEnvVars} />
        ) : (
          <MemoryUploadForm />
        )}
      </div>
    </main>
  );
}
