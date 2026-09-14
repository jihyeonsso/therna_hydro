import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { METHOD_LABEL } from "@/lib/labels";
import { Banner } from "@/components/Banner";

const CROPS = ["케일", "셀러리", "상추", "밀싹", "토마토", "딸기"];
const METHODS = ["DRIP", "FOLIAR"] as const;

export default async function AdminGuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const guides = await prisma.guideContent.findMany();
  const byKey = new Map(guides.map((g) => [`${g.cropName}__${g.method}`, g]));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-black text-text">가이드 콘텐츠 관리</h1>
      </div>
      {saved && (
        <div className="mb-4">
          <Banner variant="success">저장되었습니다</Banner>
        </div>
      )}
      <p className="mb-4 text-xs text-text-faint">
        작물 × 적용방법 조합별로 사용법 콘텐츠를 등록합니다. 비어있는 항목은 앱에서 &ldquo;확인 필요&rdquo;로 표시됩니다.
      </p>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-bg text-text-muted">
              <th className="px-4 py-2.5 font-semibold">작물</th>
              <th className="px-4 py-2.5 font-semibold">적용방법</th>
              <th className="px-4 py-2.5 font-semibold">희석배수</th>
              <th className="px-4 py-2.5 font-semibold">상태</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {CROPS.flatMap((crop) =>
              METHODS.map((method) => {
                const key = `${crop}__${method}`;
                const g = byKey.get(key);
                return (
                  <tr key={key} className="border-b border-border-subtle last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-text">{crop}</td>
                    <td className="px-4 py-2.5 text-text-muted">{METHOD_LABEL[method]}</td>
                    <td className="px-4 py-2.5 text-text">{g?.dilutionRatio ?? "-"}</td>
                    <td className="px-4 py-2.5">
                      {g ? (
                        <span className="text-primary">등록됨</span>
                      ) : (
                        <span className="text-text-faint">미등록</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/guides/edit?crop=${encodeURIComponent(crop)}&method=${method}`}
                        className="font-semibold text-primary"
                      >
                        편집
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
