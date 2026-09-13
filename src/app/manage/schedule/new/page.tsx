import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BackHeader } from "@/components/BackHeader";

export default async function ScheduleFormPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; cropId?: string; date?: string }>;
}) {
  const { id, cropId, date } = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    const qs = new URLSearchParams({ ...(id ? { id } : {}), ...(cropId ? { cropId } : {}) }).toString();
    redirect(`/login?next=${encodeURIComponent(`/manage/schedule/new${qs ? `?${qs}` : ""}`)}`);
  }

  const crops = await prisma.registeredCrop.findMany({ where: { userId: user.id } });
  const existing = id ? await prisma.schedule.findUnique({ where: { id } }) : null;

  async function save(formData: FormData) {
    "use server";
    const registeredCropId = String(formData.get("registeredCropId"));
    const scheduledDate = new Date(String(formData.get("scheduledDate")));
    const repeatRule = String(formData.get("repeatRule") || "") || null;

    if (id) {
      await prisma.schedule.update({ where: { id }, data: { registeredCropId, scheduledDate, repeatRule } });
    } else {
      await prisma.schedule.create({ data: { registeredCropId, scheduledDate, repeatRule } });
    }
    redirect("/manage?tab=schedule");
  }

  async function remove() {
    "use server";
    if (id) await prisma.schedule.delete({ where: { id } });
    redirect("/manage?tab=schedule");
  }

  const defaultCropId = existing?.registeredCropId ?? cropId ?? crops[0]?.id ?? "";
  const defaultDate = existing?.scheduledDate.toISOString().slice(0, 10) ?? date ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="일정 등록/수정" />
      <form action={save} className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">대상 작물</div>
          <select
            name="registeredCropId"
            defaultValue={defaultCropId}
            className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text"
          >
            {crops.length === 0 && <option value="">등록된 작물이 없습니다</option>}
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cropName} ({c.method === "DRIP" ? "관주식" : "엽면살포"})
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">예정일</div>
          <input
            type="date"
            name="scheduledDate"
            defaultValue={defaultDate}
            className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text"
          />
        </div>
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">반복 주기</div>
          <input
            name="repeatRule"
            defaultValue={existing?.repeatRule ?? ""}
            placeholder="예: 매주 (직접 입력 가능)"
            className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
          />
        </div>
        <button
          type="submit"
          disabled={crops.length === 0}
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white disabled:opacity-50"
        >
          저장
        </button>
      </form>
      {id && (
        <form action={remove} className="px-5 pb-6">
          <button type="submit" className="w-full text-center text-[13px] font-semibold text-danger">
            이 일정 삭제
          </button>
        </form>
      )}
    </div>
  );
}
