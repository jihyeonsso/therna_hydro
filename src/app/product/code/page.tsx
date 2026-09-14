import { redirect } from "next/navigation";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";

export default function CodeInputPage() {
  async function submitCode(formData: FormData) {
    "use server";
    const code = String(formData.get("code") ?? "").trim();
    // TODO: 실제 제품코드 검증 로직 필요 (QR/코드 규격 미확정 — 자료요청서 1항)
    // 현재는 단일 제품(ThermaVita Hydro)이라 값이 있으면 통과, 없으면 인식 실패로 처리
    if (!code) redirect("/product/scan-fail");
    redirect("/product");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="코드 입력" />
      <form action={submitCode} className="flex flex-1 flex-col gap-5 p-5 pt-7">
        <div>
          <div className="mb-2.5 text-[13px] font-bold text-text">제품코드</div>
          <input
            name="code"
            placeholder="예: TVH-2026-0001"
            className="h-[52px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
          />
        </div>
        <SubmitButton
          pendingText="확인 중..."
          className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          확인
        </SubmitButton>
        <div className="rounded-lg bg-[#EFF6EE] p-3 text-xs leading-relaxed text-text-muted">
          카메라 사용이 어려우신가요?
          <br />
          제품 포장 하단에 표기된 코드를 입력해주세요.
        </div>
      </form>
    </div>
  );
}
