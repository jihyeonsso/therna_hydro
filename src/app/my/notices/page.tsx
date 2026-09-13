import { prisma } from "@/lib/prisma";
import { BackHeader } from "@/components/BackHeader";
import { formatMonthDay } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="공지사항" />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {notices.map((n) => (
          <div key={n.id} className="rounded-[10px] border border-border bg-surface p-3.5">
            <div className="text-sm font-bold text-text">{n.title}</div>
            <div className="mt-1 text-xs text-text-faint">{formatMonthDay(n.createdAt)}</div>
            <div className="mt-2 text-[13px] leading-relaxed text-text-muted">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
