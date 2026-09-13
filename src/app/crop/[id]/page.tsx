import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackHeader } from "@/components/BackHeader";
import { METHOD_LABEL, formatMonthDay } from "@/lib/labels";

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">{label}</div>
      {children}
    </div>
  );
}

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const crop = await prisma.registeredCrop.findUnique({
    where: { id },
    include: {
      schedules: { orderBy: { scheduledDate: "asc" }, where: { scheduledDate: { gte: new Date() } }, take: 1 },
      histories: { orderBy: { appliedDate: "desc" }, take: 1 },
    },
  });
  if (!crop) notFound();

  const guide = await prisma.guideContent.findUnique({
    where: { cropName_method: { cropName: crop.cropName, method: crop.method } },
  });

  const nextSchedule = crop.schedules[0];
  const lastHistory = crop.histories[0];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title={crop.cropName} />
      <div className="flex flex-1 flex-col gap-4 p-4 pb-8">
        <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
          {METHOD_LABEL[crop.method]}
        </span>

        <div className="flex gap-2.5">
          <Link
            href={`/manage/schedule/new?cropId=${crop.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-primary text-[13px] font-bold text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <rect x="3" y="5" width="18" height="16" rx="2" />
            </svg>
            {nextSchedule ? "일정 보기" : "일정 등록"}
          </Link>
          <Link
            href={`/manage/history/new?cropId=${crop.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-primary text-[13px] font-bold text-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            이력 입력
          </Link>
        </div>

        <Card label="다음 일정 / 최근 이력">
          <div className="flex justify-between border-b border-border-subtle py-2.5 text-[13px]">
            <span className="text-text-faint">다음 일정</span>
            <span className="font-bold text-text">
              {nextSchedule
                ? `${formatMonthDay(nextSchedule.scheduledDate)}${
                    nextSchedule.repeatRule ? ` (${nextSchedule.repeatRule})` : ""
                  }`
                : "등록된 일정 없음"}
            </span>
          </div>
          <div className="flex justify-between py-2.5 text-[13px]">
            <span className="text-text-faint">최근 적용</span>
            <span className="font-bold text-text">
              {lastHistory
                ? `${formatMonthDay(lastHistory.appliedDate)}${
                    lastHistory.dilutionRatio ? ` · ${lastHistory.dilutionRatio}배` : ""
                  }`
                : "기록 없음"}
            </span>
          </div>
        </Card>

        <Card label="희석배수">
          <div className="text-[26px] font-black text-primary">{guide?.dilutionRatio ?? "000"} 배</div>
        </Card>

        {crop.method === "DRIP" ? (
          <>
            <Card label="양액 혼화 방법">
              <div className="text-[13px] leading-relaxed text-text">
                {guide?.mixingSteps?.replace(/\n/g, " → ") ?? "확인 필요"}
              </div>
            </Card>
            <Card label="EC · pH 관리 범위">
              <div className="text-[13px] text-text">
                EC {guide?.ecMin ?? "0.0"}~{guide?.ecMax ?? "0.0"} mS/cm · pH {guide?.phMin ?? "0.0"}~
                {guide?.phMax ?? "0.0"}
              </div>
            </Card>
            <Card label="순환·공급 주기">
              <div className="text-[13px] text-text">{guide?.cycleNote ?? "확인 필요"}</div>
            </Card>
          </>
        ) : (
          <>
            <Card label="살포 방법">
              <div className="text-[13px] leading-relaxed text-text">
                {guide?.sprayMethodNote?.replace(/\n/g, " → ") ?? "확인 필요"}
              </div>
            </Card>
            <Card label="살포 주기">
              <div className="text-[13px] text-text">{guide?.sprayCycleNote ?? "확인 필요"}</div>
            </Card>
          </>
        )}

        <Link
          href="/heat-timing"
          className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-primary text-[13px] font-bold text-primary"
        >
          폭염 대응 시점 안내 보기
        </Link>
      </div>
    </div>
  );
}
