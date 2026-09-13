import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createUserSession } from "@/lib/session";
import { BackHeader } from "@/components/BackHeader";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  async function signup(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const passwordConfirm = String(formData.get("passwordConfirm") || "");
    const agreed = formData.get("agreed") === "on";
    const redirectTo = String(formData.get("next") || "/");

    if (!name || !email || !password || password !== passwordConfirm || !agreed) {
      redirect(`/signup?error=1&next=${encodeURIComponent(redirectTo)}`);
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      redirect(`/signup?error=1&next=${encodeURIComponent(redirectTo)}`);
    }
    const user = await prisma.user.create({
      data: { name, email, passwordHash: await hash(password, 10) },
    });
    await createUserSession(user.id);
    redirect(encodeURI(redirectTo));
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="회원가입" />
      {error && (
        <div className="mx-5 mt-4 rounded-lg bg-danger-bg px-3.5 py-2.5 text-center text-[13px] font-semibold text-danger">
          입력값을 확인해주세요 (이미 가입된 이메일이거나 비밀번호 불일치)
        </div>
      )}
      <form action={signup} className="flex flex-1 flex-col gap-3 p-5">
        <input type="hidden" name="next" value={next ?? "/"} />
        <input
          name="name"
          required
          placeholder="이름"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="이메일"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="비밀번호"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <input
          type="password"
          name="passwordConfirm"
          required
          placeholder="비밀번호 확인"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <label className="flex items-center gap-2.5 py-3 text-[13px] text-text">
          <input type="checkbox" name="agreed" className="h-5 w-5 rounded border-border" />
          <span>
            <Link href="/terms" className="underline">
              이용약관 및 개인정보처리방침
            </Link>{" "}
            동의
          </span>
        </label>
        <button
          type="submit"
          className="mt-1 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
