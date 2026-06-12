import { ConfigurationNotice } from "@/components/configuration-notice";
import { MemoryUploadForm } from "@/components/memory-upload-form";
import { getMissingServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function UploadPage() {
  const missingEnvVars = getMissingServerEnv();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-3xl">
            추억 업로드
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            이름, 설명, 사진을 입력한 뒤 등록해 주세요.
          </p>
        </div>
        {missingEnvVars.length > 0 ? (
          <ConfigurationNotice missingKeys={missingEnvVars} />
        ) : (
          <MemoryUploadForm />
        )}
      </div>
    </main>
  );
}
