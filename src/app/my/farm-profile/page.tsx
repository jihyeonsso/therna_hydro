import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";

const SYSTEM_TYPES = ["순환식(NFT)", "담액식", "점적식"];

export default async function FarmProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/my/farm-profile")}`);

  const profile = await prisma.farmProfile.findUnique({ where: { userId: user.id } });

  async function save(formData: FormData) {
    "use server";
    const systemType = String(formData.get("systemType") || "") || null;
    await prisma.farmProfile.upsert({
      where: { userId: user!.id },
      update: { systemType },
      create: { userId: user!.id, systemType },
    });
    redirect("/my");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="재배환경 등록" />
      <form action={save} className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="mb-2 text-[13px] font-bold text-text">시스템 유형</div>
          <div className="grid grid-cols-3 gap-2">
            {SYSTEM_TYPES.map((type) => (
              <label
                key={type}
                className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-xs font-semibold text-text has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="systemType"
                  value={type}
                  defaultChecked={profile?.systemType === type}
                  className="sr-only"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <SubmitButton
          pendingText="저장 중..."
          className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          저장
        </SubmitButton>
      </form>
    </div>
  );
}
