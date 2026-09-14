import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <div className="text-base font-black text-text">페이지를 찾을 수 없습니다</div>
      <div className="text-[13px] leading-relaxed text-text-muted">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </div>
      <Link
        href="/"
        className="mt-3 flex h-[50px] w-full items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-white"
      >
        홈으로
      </Link>
    </div>
  );
}
