import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";

export default async function HistoryInputPage({
  searchParams,
}: {
  searchParams: Promise<{ cropId?: string }>;
}) {
  const { cropId } = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/manage/history/new${cropId ? `?cropId=${cropId}` : ""}`)}`);
  }

  const userId = user.id; // 아래 서버 액션 클로저에서 참조
  const crops = await prisma.registeredCrop.findMany({ where: { userId } });

  async function save(formData: FormData) {
    "use server";
    const registeredCropId = String(formData.get("registeredCropId"));
    const appliedDate = new Date(String(formData.get("appliedDate")));
    const dilutionRatioRaw = String(formData.get("dilutionRatio") || "");
    const amountRaw = String(formData.get("amountLiters") || "");
    const memo = String(formData.get("memo") || "") || null;

    // 폼에서 넘어온 작물이 실제로 내 소유인지 확인 (요청 조작 방지)
    const ownedCrop = await prisma.registeredCrop.findFirst({
      where: { id: registeredCropId, userId },
    });
    if (!ownedCrop) redirect("/manage?tab=history");

    await prisma.usageHistory.create({
      data: {
        registeredCropId,
        appliedDate,
        dilutionRatio: dilutionRatioRaw ? Number(dilutionRatioRaw) : null,
        amountLiters: amountRaw ? Number(amountRaw) : null,
        memo,
      },
    });
    redirect("/manage?tab=history&notice=saved");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="사용 이력 기록" />
      <form action={save} className="flex flex-1 flex-col gap-3.5 p-5">
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">대상 작물</div>
          <select
            name="registeredCropId"
            defaultValue={cropId ?? crops[0]?.id ?? ""}
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
          <div className="mb-2 text-[13px] font-bold text-text">적용일</div>
          <input
            type="date"
            name="appliedDate"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text"
          />
        </div>
        <div className="flex gap-2.5">
          <div className="flex-1">
            <div className="mb-2 text-[13px] font-bold text-text">희석배수</div>
            <input
              type="number"
              name="dilutionRatio"
              placeholder="000"
              className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 text-[13px] font-bold text-text">적용량(L)</div>
            <input
              type="number"
              step="0.1"
              name="amountLiters"
              placeholder="00"
              className="h-[50px] w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text placeholder:text-text-faint"
            />
          </div>
        </div>
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">메모 (선택)</div>
          <textarea
            name="memo"
            placeholder="특이사항을 입력하세요"
            className="min-h-[80px] w-full rounded-lg border border-border bg-surface p-3.5 text-sm text-text placeholder:text-text-faint"
          />
        </div>
        <SubmitButton
          disabled={crops.length === 0}
          pendingText="저장 중..."
          className="mt-1 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          저장
        </SubmitButton>
      </form>
    </div>
  );
}
