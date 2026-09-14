import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BackHeader } from "@/components/BackHeader";
import { SubmitButton } from "@/components/SubmitButton";
import type { ApplicationMethod } from "@/generated/prisma/enums";

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">{label}</div>
      {children}
    </div>
  );
}

function Steps({ text }: { text: string | null }) {
  const steps = (text ?? "확인 필요 — 부티릭스 콘텐츠 등록 대기").split("\n").filter(Boolean);
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2.5">
          <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            {i + 1}
          </div>
          <div className="text-[13px] text-text">{step}</div>
        </div>
      ))}
    </div>
  );
}

export default async function CropResultPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; method?: string }>;
}) {
  const { crop = "", method: methodParam = "DRIP" } = await searchParams;
  const method = (methodParam === "FOLIAR" ? "FOLIAR" : "DRIP") as ApplicationMethod;

  const guide = await prisma.guideContent.findUnique({
    where: { cropName_method: { cropName: crop, method } },
  });

  async function registerCrop() {
    "use server";
    const user = await getCurrentUser();
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(`/crop/result?crop=${crop}&method=${method}`)}`);
    }
    // 이미 같은 작물×적용방법이 등록되어 있으면 중복 생성하지 않고 기존 카드로 이동
    const existing = await prisma.registeredCrop.findFirst({
      where: { userId: user.id, cropName: crop, method },
    });
    if (existing) {
      redirect(`/crop/${existing.id}?notice=already_registered`);
    }
    const registered = await prisma.registeredCrop.create({
      data: { userId: user.id, cropName: crop, method },
    });
    redirect(`/crop/${registered.id}?notice=registered`);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title={`사용법 (${method === "DRIP" ? "관주식" : "엽면살포"})`} />
      <div className="flex flex-1 flex-col gap-4 p-4 pb-8">
        <div className="flex gap-2">
          <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">{crop}</span>
          <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
            {method === "DRIP" ? "관주식 양액공급" : "엽면살포"}
          </span>
        </div>

        <div className="rounded-2xl bg-primary p-6 text-center text-white">
          <div className="text-xs font-bold opacity-85">권장 희석배수</div>
          <div className="mt-1.5 text-[34px] font-black">
            {guide?.dilutionRatio ?? "000"} 배
          </div>
          {method === "FOLIAR" && (
            <div className="mt-1 text-[11px] opacity-75">* 관주식보다 묽게 희석 (일반적 경향)</div>
          )}
        </div>

        <Card label="기본 사용법">
          <div className="text-[13px] leading-relaxed text-text">
            {guide?.usageNote ?? "확인 필요 — 부티릭스 콘텐츠 등록 대기"}
          </div>
        </Card>

        {method === "DRIP" ? (
          <>
            <Card label="양액 혼화 방법">
              <Steps text={guide?.mixingSteps ?? null} />
            </Card>
            <Card label="EC · pH 관리 범위">
              <div className="text-[13px] text-text">
                EC {guide?.ecMin ?? "0.0"}~{guide?.ecMax ?? "0.0"} mS/cm · pH {guide?.phMin ?? "0.0"}~
                {guide?.phMax ?? "0.0"}
              </div>
            </Card>
            <Card label="순환·공급 주기">
              <div className="text-[13px] text-text">{guide?.cycleNote ?? "확인 필요"}</div>
            </Card>
          </>
        ) : (
          <>
            <Card label="살포 방법">
              <Steps text={guide?.sprayMethodNote ?? null} />
            </Card>
            <Card label="살포 주기">
              <div className="text-[13px] text-text">{guide?.sprayCycleNote ?? "확인 필요"}</div>
            </Card>
          </>
        )}

        <form action={registerCrop}>
          <SubmitButton
            pendingText="등록 중..."
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary text-[15px] font-bold text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            내 작물로 등록하기
          </SubmitButton>
        </form>

        <Link
          href="/heat-timing"
          className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-primary text-[13px] font-bold text-primary"
        >
          폭염 대응 시점 안내 보기
        </Link>

        {method === "FOLIAR" && (
          <Link
            href="/auto-spray-guide"
            className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-primary text-[13px] font-bold text-primary"
          >
            자동 살포 설비 연동 가이드 보기
          </Link>
        )}
      </div>
    </div>
  );
}
