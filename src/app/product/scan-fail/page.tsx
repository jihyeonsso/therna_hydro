import Link from "next/link";

export default function ScanFailPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-bg">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}>
          <path d="M12 3L2 20h20L12 3z" />
          <path d="M12 9v5M12 17h.01" />
        </svg>
      </div>
      <div className="text-base font-black text-text">제품을 인식하지 못했습니다</div>
      <div className="text-[13px] leading-relaxed text-text-muted">
        등록되지 않은 코드이거나
        <br />
        인식에 실패했습니다
      </div>
      <div className="mt-3 flex w-full flex-col gap-2.5">
        <Link
          href="/product/scan"
          className="flex h-[50px] w-full items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-white"
        >
          다시 스캔하기
        </Link>
        <Link
          href="/product/code"
          className="flex h-[50px] w-full items-center justify-center rounded-[10px] border border-primary text-sm font-bold text-primary"
        >
          코드 직접 입력
        </Link>
      </div>
    </div>
  );
}
