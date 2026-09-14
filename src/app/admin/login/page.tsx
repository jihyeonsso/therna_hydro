import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/session";
import { SubmitButton } from "@/components/SubmitButton";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const { error, email: prefillEmail } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const admin = await prisma.admin.findUnique({ where: { email } });
    const ok = admin ? await compare(password, admin.passwordHash) : false;
    if (!admin || !ok) redirect(`/admin/login?error=1&email=${encodeURIComponent(email)}`);

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
          defaultValue={prefillEmail ?? ""}
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
        <SubmitButton
          pendingText="로그인 중..."
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          로그인
        </SubmitButton>
      </form>
    </div>
  );
}
