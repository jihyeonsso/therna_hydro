import Link from "next/link";
import { BackHeader } from "@/components/BackHeader";

const CROPS = ["케일", "셀러리", "상추", "밀싹", "토마토", "딸기"];

export default function CropSelectPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="작물 선택" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-[13px] font-bold text-text">어떤 작물에 사용하시나요?</div>
        <div className="grid grid-cols-3 gap-2.5">
          {CROPS.map((crop) => (
            <Link
              key={crop}
              href={`/crop/method?crop=${encodeURIComponent(crop)}`}
              className="flex h-16 items-center justify-center rounded-[10px] border border-border bg-surface text-[13px] font-semibold text-text"
            >
              {crop}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
