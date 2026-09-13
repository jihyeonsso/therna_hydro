import { BackHeader } from "@/components/BackHeader";

export default function TermsPage() {
  // TODO: 실제 약관/개인정보처리방침 본문은 부티릭스 법무 검토 후 반영 필요
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="이용약관 · 개인정보처리방침" />
      <div className="flex-1 overflow-y-auto p-4 text-[13px] leading-relaxed text-text-muted">
        본 약관 및 개인정보처리방침 본문은 준비 중입니다. 부티릭스 법무 검토 완료 후 반영됩니다.
      </div>
    </div>
  );
}
