import Link from "next/link";
import { BackHeader } from "@/components/BackHeader";

export default async function MethodSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string }>;
}) {
  const { crop = "" } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="적용방법 선택" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="inline-block w-fit rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
          {crop}
        </div>
        <div className="text-[13px] font-bold text-text">어떤 방식으로 적용하시나요?</div>

        <Link
          href={`/crop/result?crop=${encodeURIComponent(crop)}&method=DRIP`}
          className="flex flex-col gap-2 rounded-2xl border-2 border-primary bg-[#F3F8F3] p-4.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
              <path d="M12 2c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11z" />
            </svg>
          </div>
          <div className="text-[15px] font-bold text-text">관주식 양액공급</div>
          <div className="text-xs leading-normal text-text-muted">
            기존 양액에 혼합해 순환식 시스템으로 공급 — 희석배수, 양액혼화, EC·pH, 순환주기 안내
          </div>
        </Link>

        <Link
          href={`/crop/result?crop=${encodeURIComponent(crop)}&method=FOLIAR`}
          className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-surface p-4.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
            </svg>
          </div>
          <div className="text-[15px] font-bold text-text">엽면살포</div>
          <div className="text-xs leading-normal text-text-muted">
            희석액을 잎에 직접 분무 — 희석배수, 살포방법, 살포주기 안내
          </div>
        </Link>
      </div>
    </div>
  );
}
