"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "홈",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/guide",
    label: "가이드",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
      </svg>
    ),
  },
  {
    href: "/manage",
    label: "관리",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
      </svg>
    ),
  },
  {
    href: "/my",
    label: "MY",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 shrink-0 border-t border-border bg-surface">
      {TABS.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] ${
              active ? "text-primary" : "text-text-faint"
            }`}
          >
            {tab.icon(active)}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
