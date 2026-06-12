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

        {missingEnvVars.length > 0 ? (
          <ConfigurationNotice missingKeys={missingEnvVars} />
        ) : (
          <MemoryUploadForm />
        )}
      </div>
    </main>
  );
}
