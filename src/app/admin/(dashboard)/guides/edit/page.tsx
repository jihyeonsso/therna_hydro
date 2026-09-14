import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { METHOD_LABEL } from "@/lib/labels";
import { SubmitButton } from "@/components/SubmitButton";
import type { ApplicationMethod } from "@/generated/prisma/enums";

export default async function AdminGuideEditPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; method?: string }>;
}) {
  const { crop = "", method: methodParam = "DRIP" } = await searchParams;
  const method = (methodParam === "FOLIAR" ? "FOLIAR" : "DRIP") as ApplicationMethod;

  const guide = await prisma.guideContent.findUnique({
    where: { cropName_method: { cropName: crop, method } },
  });

  async function save(formData: FormData) {
    "use server";
    const num = (v: FormDataEntryValue | null) => (v && String(v).trim() ? Number(v) : null);
    const str = (v: FormDataEntryValue | null) => (v && String(v).trim() ? String(v) : null);

    await prisma.guideContent.upsert({
      where: { cropName_method: { cropName: crop, method } },
      update: {
        dilutionRatio: num(formData.get("dilutionRatio")),
        usageNote: str(formData.get("usageNote")),
        mixingSteps: str(formData.get("mixingSteps")),
        ecMin: num(formData.get("ecMin")),
        ecMax: num(formData.get("ecMax")),
        phMin: num(formData.get("phMin")),
        phMax: num(formData.get("phMax")),
        cycleNote: str(formData.get("cycleNote")),
        sprayMethodNote: str(formData.get("sprayMethodNote")),
        sprayCycleNote: str(formData.get("sprayCycleNote")),
      },
      create: {
        cropName: crop,
        method,
        dilutionRatio: num(formData.get("dilutionRatio")),
        usageNote: str(formData.get("usageNote")),
        mixingSteps: str(formData.get("mixingSteps")),
        ecMin: num(formData.get("ecMin")),
        ecMax: num(formData.get("ecMax")),
        phMin: num(formData.get("phMin")),
        phMax: num(formData.get("phMax")),
        cycleNote: str(formData.get("cycleNote")),
        sprayMethodNote: str(formData.get("sprayMethodNote")),
        sprayCycleNote: str(formData.get("sprayCycleNote")),
      },
    });
    redirect("/admin/guides?saved=1");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-black text-text">
        {crop} · {METHOD_LABEL[method]}
      </h1>
      <p className="mb-5 text-xs text-text-faint">희석배수(배) 등 숫자 항목은 배 단위 정수로 입력하세요.</p>

      <form action={save} className="flex max-w-xl flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        <Field label="희석배수" name="dilutionRatio" type="number" defaultValue={guide?.dilutionRatio ?? ""} />
        <TextArea label="기본 사용법" name="usageNote" defaultValue={guide?.usageNote ?? ""} />

        {method === "DRIP" ? (
          <>
            <TextArea
              label="양액 혼화 방법 (줄바꿈으로 단계 구분)"
              name="mixingSteps"
              defaultValue={guide?.mixingSteps ?? ""}
              rows={4}
            />
            <div className="grid grid-cols-4 gap-3">
              <Field label="EC 최소" name="ecMin" type="number" step="0.1" defaultValue={guide?.ecMin ?? ""} />
              <Field label="EC 최대" name="ecMax" type="number" step="0.1" defaultValue={guide?.ecMax ?? ""} />
              <Field label="pH 최소" name="phMin" type="number" step="0.1" defaultValue={guide?.phMin ?? ""} />
              <Field label="pH 최대" name="phMax" type="number" step="0.1" defaultValue={guide?.phMax ?? ""} />
            </div>
            <Field label="순환·공급 주기" name="cycleNote" defaultValue={guide?.cycleNote ?? ""} />
          </>
        ) : (
          <>
            <TextArea
              label="살포 방법 (줄바꿈으로 단계 구분)"
              name="sprayMethodNote"
              defaultValue={guide?.sprayMethodNote ?? ""}
              rows={4}
            />
            <Field label="살포 주기" name="sprayCycleNote" defaultValue={guide?.sprayCycleNote ?? ""} />
          </>
        )}

        <SubmitButton pendingText="저장 중..." className="h-11 rounded-lg bg-primary text-sm font-bold text-white">
          저장
        </SubmitButton>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-text">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="h-10 rounded-lg border border-border bg-bg px-3 text-sm text-text"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-text">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="rounded-lg border border-border bg-bg p-3 text-sm text-text"
      />
    </label>
  );
}
