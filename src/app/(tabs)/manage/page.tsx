import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatMonthDay, METHOD_LABEL } from "@/lib/labels";
import { MonthCalendar } from "@/components/MonthCalendar";
import { Banner } from "@/components/Banner";

const NOTICE_TEXT: Record<string, string> = {
  saved: "저장되었습니다",
  deleted: "삭제되었습니다",
};

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
        active ? "border-primary bg-primary text-white" : "border-border bg-surface text-text-muted"
      }`}
    >
      {children}
    </Link>
  );
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; month?: string; day?: string; range?: string; crop?: string; notice?: string }>;
}) {
  const {
    tab = "schedule",
    month: monthParam,
    day: dayParam,
    range = "all",
    crop: cropFilter,
    notice,
  } = await searchParams;
  const user = await getCurrentUser();

  const now = new Date();
  const [year, month] = (monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`)
    .split("-")
    .map(Number);
  const selectedDay = dayParam ?? toKey(now);

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);

  const schedules = user
    ? await prisma.schedule.findMany({
        where: {
          registeredCrop: { userId: user.id },
          scheduledDate: { gte: monthStart, lt: monthEnd },
        },
        orderBy: { scheduledDate: "asc" },
        include: { registeredCrop: true },
      })
    : [];

  const markedDays = new Set(schedules.map((s) => toKey(s.scheduledDate)));
  const daySchedules = schedules.filter((s) => toKey(s.scheduledDate) === selectedDay);

  const registeredCrops = user ? await prisma.registeredCrop.findMany({ where: { userId: user.id } }) : [];
  const cropNames = Array.from(new Set(registeredCrops.map((c) => c.cropName)));

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const histories = user
    ? await prisma.usageHistory.findMany({
        where: {
          registeredCrop: {
            userId: user.id,
            ...(cropFilter ? { cropName: cropFilter } : {}),
          },
          ...(range === "month" ? { appliedDate: { gte: oneMonthAgo } } : {}),
        },
        orderBy: { appliedDate: "desc" },
        include: { registeredCrop: true },
      })
    : [];

  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface px-4">
        <h1 className="text-[17px] font-black text-text">사용 관리</h1>
      </header>

      <div className="mx-4 mt-3 flex shrink-0 gap-0.5 rounded-[9px] bg-[#EEF2EE] p-[3px]">
        <Link
          href="/manage?tab=schedule"
          className={`flex-1 rounded-[7px] py-2 text-center text-[13px] font-bold ${
            tab === "schedule" ? "bg-surface text-primary shadow-sm" : "text-text-muted"
          }`}
        >
          일정
        </Link>
        <Link
          href="/manage?tab=history"
          className={`flex-1 rounded-[7px] py-2 text-center text-[13px] font-bold ${
            tab === "history" ? "bg-surface text-primary shadow-sm" : "text-text-muted"
          }`}
        >
          이력
        </Link>
      </div>

      {!user && (
        <div className="mx-4 mt-4 rounded-lg border border-border bg-surface p-4 text-center text-[13px] text-text-muted">
          <Link href="/login?next=/manage" className="font-bold text-primary">
            로그인
          </Link>{" "}
          후 이용할 수 있어요
        </div>
      )}

      {notice && NOTICE_TEXT[notice] && (
        <div className="mx-4 mt-3">
          <Banner variant="success">{NOTICE_TEXT[notice]}</Banner>
        </div>
      )}

      <div className="relative flex-1 p-4">
        {tab === "schedule" ? (
          <div className="flex flex-col gap-4">
            <MonthCalendar year={year} month={month} selectedDay={selectedDay} markedDays={markedDays} />
            <div>
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                {formatMonthDay(new Date(selectedDay))} 일정
              </div>
              {daySchedules.length === 0 && (
                <div className="text-center text-sm text-text-faint">이 날짜엔 등록된 일정이 없습니다</div>
              )}
              <div className="flex flex-col gap-2.5">
                {daySchedules.map((s) => (
                  <Link
                    key={s.id}
                    href={`/manage/schedule/new?id=${s.id}`}
                    className="flex items-center justify-between rounded-[10px] border border-border bg-surface p-3.5"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-text">
                        {s.registeredCrop.cropName} · {METHOD_LABEL[s.registeredCrop.method]}
                      </div>
                      <div className="mt-0.5 text-xs text-text-faint">{s.repeatRule ?? "반복 없음"}</div>
                    </div>
                    <span className="text-border">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <FilterChip href={`/manage?tab=history&range=all${cropFilter ? `&crop=${cropFilter}` : ""}`} active={range === "all"}>
                전체
              </FilterChip>
              <FilterChip
                href={`/manage?tab=history&range=month${cropFilter ? `&crop=${cropFilter}` : ""}`}
                active={range === "month"}
              >
                최근 1개월
              </FilterChip>
              {cropNames.map((name) => (
                <FilterChip
                  key={name}
                  href={
                    cropFilter === name
                      ? `/manage?tab=history&range=${range}`
                      : `/manage?tab=history&range=${range}&crop=${encodeURIComponent(name)}`
                  }
                  active={cropFilter === name}
                >
                  {name}
                </FilterChip>
              ))}
            </div>
            {histories.length === 0 && (
              <div className="text-center text-sm text-text-faint">등록된 이력이 없습니다</div>
            )}
            {histories.map((h) => (
              <div key={h.id} className="rounded-[10px] border border-border bg-surface p-3.5">
                <div className="text-[13px] font-bold text-text">
                  {formatMonthDay(h.appliedDate)} · {h.registeredCrop.cropName}
                </div>
                <div className="mt-0.5 text-xs text-text-faint">
                  희석 {h.dilutionRatio ?? "-"}배 · 적용량 {h.amountLiters ?? "-"}L
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={
            tab === "schedule"
              ? `/manage/schedule/new?date=${selectedDay}`
              : "/manage/history/new"
          }
          className="absolute bottom-6 right-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>
    </>
  );
}
