import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { METHOD_LABEL, formatMonthDay } from "@/lib/labels";

function daysUntil(target: Date): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function HomePage() {
  const user = await getCurrentUser();

  const urgentNotice = await prisma.notice.findFirst({
    where: { isUrgent: true },
    orderBy: { createdAt: "desc" },
  });
  const notice = await prisma.notice.findFirst({ orderBy: { createdAt: "desc" } });
  const noticeCount = await prisma.notice.count();

  const crops = user
    ? await prisma.registeredCrop.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        include: {
          schedules: { orderBy: { scheduledDate: "asc" }, where: { scheduledDate: { gte: new Date() } }, take: 1 },
          histories: { orderBy: { appliedDate: "desc" }, take: 1 },
        },
      })
    : [];

  const upcoming = crops
    .filter((c) => c.schedules[0])
    .sort((a, b) => a.schedules[0].scheduledDate.getTime() - b.schedules[0].scheduledDate.getTime())[0];

  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        <h1 className="text-[17px] font-black text-text">ThermaVita Hydro</h1>
      </header>

      <div className="flex flex-col gap-3.5 p-4">
        {user && upcoming && (
          <div className="text-[15px] font-bold text-text">
            {user.name}님, {upcoming.cropName} 다음 일정까지{" "}
            <span className="text-primary">
              {(() => {
                const d = daysUntil(upcoming.schedules[0].scheduledDate);
                return d <= 0 ? "오늘" : `D-${d}`;
              })()}
            </span>
          </div>
        )}

        {urgentNotice && (
          <Link
            href="/my/notices"
            className="flex items-start gap-2.5 rounded-[10px] border border-warning-border bg-warning-bg p-3.5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B45309"
              strokeWidth={2}
              className="mt-0.5 shrink-0"
            >
              <path d="M12 3L2 20h20L12 3z" />
              <path d="M12 9v5M12 17h.01" />
            </svg>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-warning-text">긴급 공지</div>
              <div className="mt-0.5 text-xs text-warning-text">{urgentNotice.title}</div>
            </div>
          </Link>
        )}

        {notice && (
          <Link
            href="/my/notices"
            className="flex items-start gap-2.5 rounded-[10px] border border-[#CFE3D1] bg-[#EFF6EE] p-3.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C8368" strokeWidth={2} className="mt-0.5 shrink-0">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-text">공지사항</div>
              <div className="mt-0.5 text-xs text-text-muted">
                {notice.title}
                {noticeCount > 1 ? ` 외 ${noticeCount - 1}건` : ""}
              </div>
            </div>
            <div className="text-xs font-semibold text-primary">더보기</div>
          </Link>
        )}

        <div className="flex flex-col gap-3 rounded-2xl bg-primary p-4">
          <div className="text-base font-black text-white">ThermaVita Hydro</div>
          <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-b from-white to-[#E9F1EA] p-3">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-soft blur-2xl" />
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-black/15 blur-md" />
            <Image
              src="/images/product-thermavita.png"
              alt="ThermaVita Hydro 제품 사진"
              width={200}
              height={280}
              className="relative h-full w-auto object-contain mix-blend-multiply drop-shadow-[0_10px_14px_rgba(0,0,0,0.18)]"
              priority
            />
          </div>
          <div className="flex gap-2">
            <Link
              href="/product"
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-white text-xs font-bold text-primary"
            >
              제품 정보 보기
            </Link>
            <Link
              href="/product/scan"
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/40 bg-white/10 text-xs font-bold text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
              </svg>
              새로 스캔하기
            </Link>
          </div>
        </div>

        {crops.length > 0 && (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
              ThermaVita Hydro 적용 현황 ({crops.length})
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {crops.map((crop) => {
                const next = crop.schedules[0];
                const last = crop.histories[0];
                return (
                  <Link
                    key={crop.id}
                    href={`/crop/${crop.id}`}
                    className="flex w-[164px] shrink-0 flex-col gap-2.5 rounded-xl border border-border bg-surface p-3.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-soft">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
                        <path d="M12 2c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text">{crop.cropName}</div>
                      <div className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">
                        {METHOD_LABEL[crop.method]}
                      </div>
                      <div className="mt-1.5 text-[11px] text-text-faint">
                        {next
                          ? `다음 일정: ${formatMonthDay(next.scheduledDate)}`
                          : last
                          ? `최근 적용: ${formatMonthDay(last.appliedDate)}`
                          : "등록된 일정/이력 없음"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
