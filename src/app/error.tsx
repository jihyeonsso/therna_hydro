"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-bg">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}>
          <path d="M12 3L2 20h20L12 3z" />
          <path d="M12 9v5M12 17h.01" />
        </svg>
      </div>
      <div className="text-base font-black text-text">문제가 발생했습니다</div>
      <div className="text-[13px] leading-relaxed text-text-muted">
        일시적인 오류일 수 있어요.
        <br />
        다시 시도해주세요.
      </div>
      <div className="mt-3 flex w-full flex-col gap-2.5">
        <button
          onClick={() => reset()}
          className="flex h-[50px] w-full items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-white"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="flex h-[50px] w-full items-center justify-center rounded-[10px] border border-primary text-sm font-bold text-primary"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
