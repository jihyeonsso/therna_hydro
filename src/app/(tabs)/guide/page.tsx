import Link from "next/link";

const CROPS = ["케일", "셀러리", "상추", "밀싹", "토마토", "딸기"];

export default function GuideHomePage() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        <h1 className="text-[17px] font-black text-text">가이드</h1>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-[10px] border border-[#CFE3D1] bg-[#EFF6EE] p-3.5 text-[13px] leading-relaxed text-text">
          등록하지 않아도 작물별 ThermaVita Hydro 사용법을 미리 살펴볼 수 있어요. 실제로 사용 중인 작물은 홈에서
          등록해 관리하세요.
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted">작물을 선택하세요</div>
        <div className="grid grid-cols-3 gap-2.5">
          {CROPS.map((crop) => (
            <Link
              key={crop}
              href={`/crop/method?crop=${encodeURIComponent(crop)}`}
              className="flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[10px] border border-border bg-surface text-xs font-semibold text-text"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
                <path d="M12 2c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11z" />
              </svg>
              {crop}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
