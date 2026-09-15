import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/session";
import { isLoginLocked, nextLockoutState } from "@/lib/auth";
import { SubmitButton } from "@/components/SubmitButton";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "이메일 또는 비밀번호가 올바르지 않습니다",
  locked: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요",
};

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
    const fail = (code: string) => redirect(`/admin/login?error=${code}&email=${encodeURIComponent(email)}`);

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin && isLoginLocked(admin.lockedUntil)) {
      fail("locked");
    }

    const ok = admin ? await compare(password, admin.passwordHash) : false;
    if (!admin || !ok) {
      if (admin) {
        const lockState = nextLockoutState(admin.failedLoginAttempts, admin.lockedUntil);
        await prisma.admin.update({ where: { id: admin.id }, data: lockState });
        if (lockState.lockedUntil) fail("locked");
      }
      fail("invalid");
    }
    if (admin!.failedLoginAttempts > 0 || admin!.lockedUntil) {
      await prisma.admin.update({ where: { id: admin!.id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
    }
    await createAdminSession(admin!.id);
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center bg-bg px-7">
      <div className="mb-6 text-center text-lg font-black text-text">ThermaVita Hydro 관리자</div>
      {error && (
        <div className="mb-3 rounded-lg bg-danger-bg px-3.5 py-2.5 text-center text-[13px] font-semibold text-danger">
          {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.invalid}
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
