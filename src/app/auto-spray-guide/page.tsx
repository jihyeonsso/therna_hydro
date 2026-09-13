import { BackHeader } from "@/components/BackHeader";

export default function AutoSprayGuidePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="자동 살포 설비 연동 가이드" />
      <div className="flex-1 p-4">
        <div className="rounded-[10px] border border-border bg-surface p-4 text-[13px] leading-relaxed text-text">
          점적/분무 디스펜서 등 자동화 설비 사용 시 주의사항 — 여과·정제로 노즐막힘 방지된 제형이나, 필터 점검
          주기 등은 부티릭스 확인 후 반영 예정입니다.
        </div>
      </div>
    </div>
  );
}
