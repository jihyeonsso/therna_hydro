"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 앱 전역에서 쓰는 토스트 메시지 코드. crop/[id], manage, my, admin 등에서
// redirect(`...?notice=<code>`) 형태로 공통 사용.
const NOTICE_MESSAGES: Record<string, string> = {
  saved: "저장되었습니다",
  deleted: "삭제되었습니다",
  created: "등록되었습니다",
  registered: "내 작물로 등록되었습니다",
  already_registered: "이미 등록되어 있는 작물이에요",
  withdrawn: "탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.",
};

function ToastInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const code = searchParams.get("notice");
  const message = code ? NOTICE_MESSAGES[code] : null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 2200);
    const cleanupTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("notice");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 2600);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(cleanupTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!message) return null;

  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-text px-5 py-3 text-center text-[13px] font-semibold text-white shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}

export function Toast() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  );
}
