import { prisma } from "@/lib/prisma";
import { BackHeader } from "@/components/BackHeader";

export const dynamic = "force-dynamic";

export default async function HeatTimingPage() {
  const guide = await prisma.heatTimingGuide.findFirst();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="폭염 대응 시점 안내" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start gap-2.5 rounded-[10px] border border-[#F3D9A8] bg-[#FEF3E2] p-3.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth={2} className="shrink-0">
            <path d="M12 3L2 20h20L12 3z" />
            <path d="M12 9v5M12 17h.01" />
          </svg>
          <div className="text-[13px] font-semibold leading-relaxed text-[#7C4A0A]">
            고온기 이전 선제적 적용이 중요합니다
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">안내</div>
          <div className="text-[13px] leading-relaxed text-text">
            {guide?.content ??
              "발생 후 대응보다 발생 전 선제 처리가 작물의 방어기전 준비에 효과적입니다. 정확한 리드타임은 부티릭스 실증 데이터 확보 후 확정 예정입니다."}
          </div>
        </div>
      </div>
    </div>
  );
}
