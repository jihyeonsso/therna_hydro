import { BackHeader } from "@/components/BackHeader";

export default function WithdrawPage() {
  // TODO: 실제 탈퇴 처리(계정/데이터 삭제 정책) 미구현 — 법무 요건 확인 필요
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="회원 탈퇴" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="text-[13px] leading-relaxed text-text-muted">
          탈퇴 시 등록된 작물, 일정, 이력 정보가 모두 삭제되며 복구할 수 없습니다.
        </div>
        <button className="flex h-[52px] w-full items-center justify-center rounded-[10px] border border-danger text-[15px] font-bold text-danger">
          탈퇴하기
        </button>
      </div>
    </div>
  );
}
