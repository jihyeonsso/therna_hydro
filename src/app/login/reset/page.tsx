import { BackHeader } from "@/components/BackHeader";

// TODO: 실제 재설정 메일 발송 로직 미구현 (이메일 발송 인프라 필요) — 현재는 화면만 존재
export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="비밀번호 재설정" />
      <form className="flex flex-1 flex-col gap-4 p-5">
        <input
          type="email"
          placeholder="가입한 이메일"
          className="h-[52px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
        />
        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          재설정 링크 받기
        </button>
      </form>
    </div>
  );
}
