import Link from "next/link";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function MonthCalendar({
  year,
  month, // 1-12
  selectedDay, // "YYYY-MM-DD"
  markedDays, // Set of "YYYY-MM-DD"
}: {
  year: number;
  month: number;
  selectedDay: string;
  markedDays: Set<string>;
}) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const startWeekday = firstOfMonth.getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate();

  const todayKey = toKey(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

  const prevMonth = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextMonth = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  const cells: { day: number | null; key: string | null }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null, key: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: toKey(year, month, d) });

  return (
    <div className="rounded-[10px] border border-border bg-surface p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <Link
          href={`/manage?tab=schedule&month=${prevMonth.y}-${String(prevMonth.m).padStart(2, "0")}`}
          className="px-2 text-text-muted"
        >
          ‹
        </Link>
        <div className="text-sm font-bold text-text">
          {year}년 {month}월
        </div>
        <Link
          href={`/manage?tab=schedule&month=${nextMonth.y}-${String(nextMonth.m).padStart(2, "0")}`}
          className="px-2 text-text-muted"
        >
          ›
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="flex aspect-square items-center justify-center text-[11px] text-border">
            {w}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (cell.day === null) return <div key={i} />;
          const isToday = cell.key === todayKey;
          const isSelected = cell.key === selectedDay;
          const hasMark = cell.key ? markedDays.has(cell.key) : false;
          return (
            <Link
              key={i}
              href={`/manage?tab=schedule&month=${year}-${String(month).padStart(2, "0")}&day=${cell.key}`}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md text-[11px] ${
                isSelected
                  ? "bg-primary font-bold text-white"
                  : isToday
                  ? "bg-primary-soft font-bold text-primary"
                  : "text-text-muted"
              }`}
            >
              {cell.day}
              {hasMark && !isSelected && <div className="h-1 w-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
