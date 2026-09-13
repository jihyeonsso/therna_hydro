"use client";

import { useRouter } from "next/navigation";

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <button onClick={() => router.back()} aria-label="뒤로가기" className="text-text">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="text-base font-bold text-text">{title}</div>
    </header>
  );
}
