import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { METHOD_LABEL, formatMonthDay } from "@/lib/labels";

export default async function HomePage() {
  const user = await getCurrentUser();

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

  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        <h1 className="text-[17px] font-black text-text">ThermaVita Hydro</h1>
      </header>

      <div className="flex flex-col gap-3.5 p-4">
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
          <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-white/40 bg-white/10 text-xs font-semibold text-white/75">
            제품 사진
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
            {crops.map((crop) => {
              const next = crop.schedules[0];
              const last = crop.histories[0];
              return (
                <Link
                  key={crop.id}
                  href={`/crop/${crop.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2}>
                      <path d="M12 2c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text">{crop.cropName}</div>
                    <div className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">
                      {METHOD_LABEL[crop.method]}
                    </div>
                    <div className="mt-1 text-[11px] text-text-faint">
                      {next
                        ? `다음 일정: ${formatMonthDay(next.scheduledDate)}`
                        : last
                        ? `최근 적용: ${formatMonthDay(last.appliedDate)}`
                        : "등록된 일정/이력 없음"}
                    </div>
                  </div>
                  <span className="text-border">›</span>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
