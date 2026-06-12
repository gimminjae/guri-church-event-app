import Link from "next/link";
import { ConfigurationNotice } from "@/components/configuration-notice";
import { EventSceneBackdrop } from "@/components/event-scene-backdrop";
import { getMissingServerEnv } from "@/lib/env";
import { EVENT_COPY } from "@/lib/event";

export const dynamic = "force-dynamic";

export default async function Home() {
  const missingEnvVars = getMissingServerEnv();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <EventSceneBackdrop />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="event-panel rounded-[36px] px-5 py-7 sm:px-8 sm:py-9">
          <div className="mx-auto max-w-4xl text-center">
            <p className="event-outline-kicker text-4xl sm:text-5xl">
              {EVENT_COPY.year}
            </p>
            <h1 className="event-outline-title mt-3 text-[3.35rem] leading-[0.92] sm:text-[5.2rem]">
              {EVENT_COPY.seasonTitle}
              <br />
              {EVENT_COPY.eventTitle}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-sm font-bold text-sky-950 sm:text-base">
              <span className="rounded-full bg-sky-100/80 px-4 py-2 shadow-[0_8px_20px_rgba(33,110,178,0.12)]">
                이벤트 기간 {EVENT_COPY.eventPeriod}
              </span>
            </div>
            <p className="mt-5 text-xl font-black tracking-[-0.04em] text-slate-900 sm:text-3xl">
              {EVENT_COPY.entryTitle}
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="event-panel-strong rounded-[30px] px-5 py-5 text-left sm:px-6">
              <p className="text-sm font-black text-slate-900">
                응모자를 추첨하여
              </p>
              <p className="text-sm font-black text-slate-900">
                <span className="event-highlight">{EVENT_COPY.prizeTitle}</span>
                를 선물로 드립니다!
              </p>
              <div className="event-divider mt-4" />
              <p className="mt-5 text-base font-bold text-slate-900">
                발표:{" "}
                <span className="event-highlight">
                  {EVENT_COPY.announcementDate}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {EVENT_COPY.announcementChannel}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="event-panel-strong rounded-[30px] px-5 py-5 text-left">
                <p className="text-sm font-black text-sky-700">STEP 1</p>
                <p className="mt-2 text-lg font-black tracking-[-0.04em] text-slate-900">
                  기억에 남는 사진을 고르기
                </p>
              </div>
              <div className="event-panel-strong rounded-[30px] px-5 py-5 text-left">
                <p className="text-sm font-black text-sky-700">STEP 2</p>
                <p className="mt-2 text-lg font-black tracking-[-0.04em] text-slate-900">
                  사진과 짧은 설명 남기기
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/upload"
              className="event-button-primary inline-flex h-[52px] items-center justify-center rounded-full px-6 text-base font-black text-white transition hover:-translate-y-0.5"
            >
              참여하기
            </Link>
            <Link
              href="/gallery"
              className="event-button-secondary inline-flex h-[52px] items-center justify-center rounded-full px-6 text-base font-black text-sky-950 transition hover:-translate-y-0.5"
            >
              이미지 보기
            </Link>
          </div>

          {missingEnvVars.length > 0 ? (
            <div className="mt-6">
              <ConfigurationNotice missingKeys={missingEnvVars} />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
