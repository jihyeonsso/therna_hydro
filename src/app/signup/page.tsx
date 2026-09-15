import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { createUserSession } from "@/lib/session";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";

const ERROR_MESSAGES: Record<string, string> = {
  name: "이름을 입력해주세요",
  email: "이메일을 입력해주세요",
  email_invalid: "올바른 이메일 형식이 아닙니다",
  password_short: "비밀번호는 8자 이상이어야 합니다",
  password_mismatch: "비밀번호가 서로 일치하지 않습니다",
  terms: "이용약관에 동의해주세요",
  email_taken: "이미 가입된 이메일입니다",
};

// 브라우저 type="email" 검증은 우회 가능하므로 서버에서도 형식을 다시 확인
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; name?: string; email?: string }>;
}) {
  const { error, next, name: prefillName, email: prefillEmail } = await searchParams;

  async function signup(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const passwordConfirm = String(formData.get("passwordConfirm") || "");
    const agreed = formData.get("agreed") === "on";
    const redirectTo = String(formData.get("next") || "/");

    const prefill = `next=${encodeURIComponent(redirectTo)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    const fail = (code: string) => redirect(`/signup?error=${code}&${prefill}`);

    if (!name) fail("name");
    if (!email) fail("email");
    if (!EMAIL_PATTERN.test(email)) fail("email_invalid");
    if (password.length < 8) fail("password_short");
    if (password !== passwordConfirm) fail("password_mismatch");
    if (!agreed) fail("terms");

    let user;
    try {
      user = await prisma.user.create({
        data: { name, email, passwordHash: await hash(password, 10) },
      });
    } catch (e) {
      // 동시에 같은 이메일로 가입 요청이 들어와 유니크 제약을 위반한 경우도 여기서 함께 처리됨
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        fail("email_taken");
      }
      throw e;
    }
    await createUserSession(user.id);
    redirect(encodeURI(redirectTo));
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="회원가입" />
      {error && (
        <div className="mx-5 mt-4 rounded-lg bg-danger-bg px-3.5 py-2.5 text-center text-[13px] font-semibold text-danger">
          {ERROR_MESSAGES[error] ?? "입력값을 확인해주세요"}
        </div>
      )}
      <form action={signup} className="flex flex-1 flex-col gap-3 p-5">
        <input type="hidden" name="next" value={next ?? "/"} />
        <input
          name="name"
          required
          defaultValue={prefillName ?? ""}
          placeholder="이름"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <input
          type="email"
          name="email"
          required
          defaultValue={prefillEmail ?? ""}
          placeholder="이메일"
          className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <div>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="비밀번호 (8자 이상)"
            className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
          />
        </div>
        <input
          type="password"
          name="passwordConfirm"
          required
          minLength={8}
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
        <SubmitButton
          pendingText="가입 처리 중..."
          className="mt-1 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          가입하기
        </SubmitButton>
      </form>
    </div>
  );
}
