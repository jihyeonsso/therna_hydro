import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatMonthDay } from "@/lib/labels";

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });

  async function create(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const isUrgent = formData.get("isUrgent") === "on";
    if (!title || !body) return;
    await prisma.notice.create({ data: { title, body, isUrgent } });
    revalidatePath("/admin/notices");
    revalidatePath("/");
    revalidatePath("/my/notices");
  }

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await prisma.notice.delete({ where: { id } });
    revalidatePath("/admin/notices");
    revalidatePath("/");
    revalidatePath("/my/notices");
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-black text-text">공지사항 관리</h1>

      <form action={create} className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
        <input
          name="title"
          required
          placeholder="제목"
          className="h-10 rounded-lg border border-border bg-bg px-3 text-sm text-text"
        />
        <textarea
          name="body"
          required
          placeholder="내용"
          rows={3}
          className="rounded-lg border border-border bg-bg p-3 text-sm text-text"
        />
        <label className="flex items-center gap-2 text-[13px] text-text">
          <input type="checkbox" name="isUrgent" className="h-4 w-4" />
          긴급 공지(경고색 배너로 별도 노출 — 2차 화면 구현 예정)
        </label>
        <button type="submit" className="h-10 w-fit rounded-lg bg-primary px-5 text-sm font-bold text-white">
          등록
        </button>
      </form>

      <div className="flex flex-col gap-2.5">
        {notices.map((n) => (
          <div key={n.id} className="flex items-start justify-between rounded-xl border border-border bg-surface p-4">
            <div>
              <div className="text-sm font-bold text-text">
                {n.isUrgent && <span className="mr-1.5 text-danger">[긴급]</span>}
                {n.title}
              </div>
              <div className="mt-1 text-xs text-text-faint">{formatMonthDay(n.createdAt)}</div>
              <div className="mt-1.5 text-[13px] text-text-muted">{n.body}</div>
            </div>
            <form action={remove}>
              <input type="hidden" name="id" value={n.id} />
              <button type="submit" className="text-xs font-semibold text-danger">
                삭제
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
