import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/SubmitButton";

export default async function AdminProductsPage() {
  const product = await prisma.product.findFirst();

  async function save(formData: FormData) {
    "use server";
    const data = {
      name: String(formData.get("name") || "ThermaVita Hydro"),
      ingredientSummary: String(formData.get("ingredientSummary") || "") || null,
      filtrationNote: String(formData.get("filtrationNote") || "") || null,
      phEcStabilityNote: String(formData.get("phEcStabilityNote") || "") || null,
    };
    if (product) {
      await prisma.product.update({ where: { id: product.id }, data });
    } else {
      await prisma.product.create({ data: { id: "singleton", ...data } });
    }
    revalidatePath("/admin/products");
    revalidatePath("/product");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-black text-text">제품 정보 관리</h1>
      <form action={save} className="flex max-w-lg flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        <Field label="제품명" name="name" defaultValue={product?.name ?? "ThermaVita Hydro"} />
        <TextArea label="원료 설명" name="ingredientSummary" defaultValue={product?.ingredientSummary ?? ""} />
        <TextArea label="여과·정제 특성 설명" name="filtrationNote" defaultValue={product?.filtrationNote ?? ""} />
        <TextArea label="pH/EC 안정성 설명" name="phEcStabilityNote" defaultValue={product?.phEcStabilityNote ?? ""} />
        <p className="text-xs text-text-faint">
          * 제품 사진 업로드는 2차(에셋 스토리지 연동) 예정. 지금은 앱 화면에 플레이스홀더로 표시됩니다.
        </p>
        <SubmitButton pendingText="저장 중..." className="h-11 rounded-lg bg-primary text-sm font-bold text-white">
          저장
        </SubmitButton>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-text">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-10 rounded-lg border border-border bg-bg px-3 text-sm text-text"
      />
    </label>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-text">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="rounded-lg border border-border bg-bg p-3 text-sm text-text"
      />
    </label>
  );
}
