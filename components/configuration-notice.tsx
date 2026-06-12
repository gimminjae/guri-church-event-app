type ConfigurationNoticeProps = {
  missingKeys: string[];
};

export function ConfigurationNotice({
  missingKeys,
}: ConfigurationNoticeProps) {
  return (
    <section className="rounded-[30px] border border-dashed border-stone-950/15 bg-white/75 px-5 py-5 text-stone-900 shadow-[0_16px_60px_rgba(73,34,17,0.08)] backdrop-blur sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700/75">
        Configuration needed
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
        환경변수를 먼저 채워 주세요
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        아래 항목이 비어 있어 현재 업로드와 목록 조회를 실행하지 못하고
        있어요. 프로젝트 루트의 <code>.env.local</code> 에 값을 넣으면 바로
        동작하도록 구현되어 있습니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {missingKeys.map((key) => (
          <code
            key={key}
            className="rounded-full border border-stone-950/10 bg-stone-950/[0.04] px-3 py-1 text-xs font-medium text-stone-800"
          >
            {key}
          </code>
        ))}
      </div>
    </section>
  );
}
