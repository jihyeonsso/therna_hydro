import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

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

  const userId = user.id; // 아래 서버 액션 클로저에서 참조 (TS가 user의 null 좁히기를 클로저까지 못 미치므로)
  const crops = await prisma.registeredCrop.findMany({ where: { userId } });
  // 소유자 검증: 내 작물에 속한 일정만 조회 가능 (다른 사용자의 일정 id를 넣어도 안 보임)
  const existing = id
    ? await prisma.schedule.findFirst({ where: { id, registeredCrop: { userId } } })
    : null;
  if (id && !existing) notFound();

  async function save(formData: FormData) {
    "use server";
    const registeredCropId = String(formData.get("registeredCropId"));
    const scheduledDate = new Date(String(formData.get("scheduledDate")));
    const repeatRule = String(formData.get("repeatRule") || "") || null;

    // 폼에서 넘어온 작물이 실제로 내 소유인지 확인 (요청 조작 방지)
    const ownedCrop = await prisma.registeredCrop.findFirst({
      where: { id: registeredCropId, userId },
    });
    if (!ownedCrop) redirect("/manage?tab=schedule");

    if (id) {
      // 수정 대상 일정도 내 소유인지 재확인 후 수정
      const owned = await prisma.schedule.findFirst({ where: { id, registeredCrop: { userId } } });
      if (!owned) redirect("/manage?tab=schedule");
      await prisma.schedule.update({ where: { id }, data: { registeredCropId, scheduledDate, repeatRule } });
    } else {
      await prisma.schedule.create({ data: { registeredCropId, scheduledDate, repeatRule } });
    }
    redirect("/manage?tab=schedule&notice=saved");
  }

  async function remove() {
    "use server";
    if (id) {
      // 내 소유의 일정일 때만 삭제 허용
      await prisma.schedule.deleteMany({ where: { id, registeredCrop: { userId } } });
    }
    redirect("/manage?tab=schedule&notice=deleted");
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
        <SubmitButton
          disabled={crops.length === 0}
          pendingText="저장 중..."
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          저장
        </SubmitButton>
      </form>
      {id && (
        <form action={remove} className="px-5 pb-6">
          <ConfirmSubmitButton
            confirmMessage="이 일정을 삭제하시겠습니까? 삭제하면 되돌릴 수 없습니다."
            pendingText="삭제 중..."
            className="w-full text-center text-[13px] font-semibold text-danger"
          >
            이 일정 삭제
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
