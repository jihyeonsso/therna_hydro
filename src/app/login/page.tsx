import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createUserSession } from "@/lib/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const redirectTo = String(formData.get("next") || "/");

    const user = await prisma.user.findUnique({ where: { email } });
    const ok = user ? await compare(password, user.passwordHash) : false;
    if (!user || !ok) {
      redirect(`/login?error=1&next=${encodeURIComponent(redirectTo)}`);
    }
    await createUserSession(user.id);
    // redirectTo가 hidden input을 거치며 URL-디코딩된 상태(한글 등 비ASCII 포함 가능)로 들어오므로,
    // redirect()에 그대로 넘기면 응답 헤더(x-action-redirect)에 비ASCII 문자가 들어가 에러가 남.
    // encodeURI로 재인코딩(경로 구분자 /,?,&,= 는 보존)한 뒤 redirect.
    redirect(encodeURI(redirectTo));
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg px-7 pt-6">
      <Link href="/" aria-label="닫기" className="mb-8 text-text">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
          <path d="M12 2C8 6 6 10 6 13a6 6 0 0 0 12 0c0-3-2-7-6-11z" />
        </svg>
      </div>
      <div className="mb-2 text-center text-lg font-black text-text">ThermaVita Hydro</div>
      {error && (
        <div className="mb-3 rounded-lg bg-danger-bg px-3.5 py-2.5 text-center text-[13px] font-semibold text-danger">
          이메일 또는 비밀번호가 올바르지 않습니다
        </div>
      )}
      <form action={login} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next ?? "/"} />
        <input
          type="email"
          name="email"
          required
          placeholder="이메일"
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
      <div className="mt-5 flex justify-center gap-4 text-[13px] text-text-muted">
        <Link href={`/signup?next=${encodeURIComponent(next ?? "/")}`}>회원가입</Link>
        <span className="text-border">|</span>
        <Link href="/login/reset">비밀번호 찾기</Link>
      </div>
      <div className="mt-8 text-center text-xs text-text-faint">
        데모 계정: demo@example.com / password123
      </div>
    </div>
  );
}
