import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BackHeader } from "@/components/BackHeader";

// 관리자가 언제든 내용을 바꿀 수 있는 콘텐츠라 빌드 시점에 정적으로 굳지 않도록 강제
export const dynamic = "force-dynamic";

export default async function ProductInfoPage() {
  const product = await prisma.product.findFirst();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="제품 정보" />
      <div className="flex flex-1 flex-col gap-3.5 p-4 pb-8">
        <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-[10px] border border-border bg-gradient-to-b from-white to-[#E9F1EA] p-3">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-soft blur-2xl" />
          <div className="pointer-events-none absolute bottom-5 left-1/2 h-3.5 w-24 -translate-x-1/2 rounded-full bg-black/15 blur-md" />
          <Image
            src="/images/product-thermavita.png"
            alt={`${product?.name ?? "ThermaVita Hydro"} 제품 사진`}
            width={220}
            height={300}
            className="relative h-full w-auto object-contain mix-blend-multiply drop-shadow-[0_10px_14px_rgba(0,0,0,0.18)]"
          />
        </div>
        <div>
          <div className="text-[19px] font-black text-text">{product?.name ?? "ThermaVita Hydro"}</div>
          <span className="mt-1.5 inline-block rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
            수경·양액 시스템 특화
          </span>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">원료</div>
          <div className="text-[13px] leading-relaxed text-text">
            {product?.ingredientSummary ?? "확인 필요 — 부티릭스 콘텐츠 등록 대기"}
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">제품 특성</div>
          <div className="flex items-start gap-2.5 py-1 text-[13px] text-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2} className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l3 3 5-5" />
            </svg>
            {product?.filtrationNote ?? "여과·정제 처리 — 침전·노즐막힘 방지"}
          </div>
          <div className="flex items-start gap-2.5 py-1 text-[13px] text-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7D5F" strokeWidth={2} className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l3 3 5-5" />
            </svg>
            {product?.phEcStabilityNote ?? "pH·EC 안정성 확보 제형"}
          </div>
        </div>

        <Link
          href="/crop/select"
          className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-primary text-[15px] font-bold text-white"
        >
          사용가이드 보러가기
        </Link>
      </div>
    </div>
  );
}
