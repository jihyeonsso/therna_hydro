import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/session";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const admin = await prisma.admin.findUnique({ where: { email } });
    const ok = admin ? await compare(password, admin.passwordHash) : false;
    if (!admin || !ok) redirect("/admin/login?error=1");

    await createAdminSession(admin.id);
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center bg-bg px-7">
      <div className="mb-6 text-center text-lg font-black text-text">ThermaVita Hydro 관리자</div>
      {error && (
        <div className="mb-3 rounded-lg bg-danger-bg px-3.5 py-2.5 text-center text-[13px] font-semibold text-danger">
          이메일 또는 비밀번호가 올바르지 않습니다
        </div>
      )}
      <form action={login} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="관리자 이메일"
          className="h-[52px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="비밀번호"
          className="h-[52px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <button
          type="submit"
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          로그인
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-text-faint">데모 관리자: admin@example.com / admin1234</div>
    </div>
  );
}
