import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/products", label: "제품 정보" },
  { href: "/admin/guides", label: "가이드 콘텐츠" },
  { href: "/admin/notices", label: "공지사항" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
        <div className="flex items-center gap-6">
          <span className="text-[15px] font-black text-text">ThermaVita Hydro 관리자</span>
          <nav className="flex gap-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-[13px] font-semibold text-text-muted hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/admin/logout" className="text-[13px] font-semibold text-text-muted hover:text-danger">
          로그아웃
        </Link>
      </header>
      <main className="mx-auto max-w-3xl p-6">{children}</main>
    </div>
  );
}
