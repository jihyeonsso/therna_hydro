import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function MyPage() {
  const user = await getCurrentUser();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        <h1 className="text-[17px] font-black text-text">마이페이지</h1>
      </header>

      <div className="flex flex-col gap-4 p-4">
        {user ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold text-text">{user.name} 님</div>
              <div className="mt-0.5 text-xs text-text-faint">{user.email}</div>
            </div>
          </div>
        ) : (
          <Link
            href="/login?next=/my"
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
          >
            <span className="text-[15px] font-bold text-text">로그인이 필요합니다</span>
            <span className="text-sm font-bold text-primary">로그인 ›</span>
          </Link>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <MenuItem href="/my/farm-profile" label="재배환경 관리" />
          <MenuItem href="/my/notices" label="공지사항 전체보기" />
          <MenuItem href="/terms" label="이용약관 · 개인정보처리방침" last />
        </div>

        {user && (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <MenuItem href="/logout" label="로그아웃" plain />
            <MenuItem href="/my/withdraw" label="회원 탈퇴" danger last />
          </div>
        )}
      </div>
    </>
  );
}

function MenuItem({
  href,
  label,
  last,
  danger,
  plain,
}: {
  href: string;
  label: string;
  last?: boolean;
  danger?: boolean;
  plain?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 text-sm font-semibold ${
        last ? "" : "border-b border-border-subtle"
      } ${danger ? "text-danger" : "text-text"}`}
    >
      {label}
      {!plain && <span className="ml-auto text-border">›</span>}
    </Link>
  );
}
