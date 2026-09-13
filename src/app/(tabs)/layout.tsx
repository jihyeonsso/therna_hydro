import { BottomTabBar } from "@/components/BottomTabBar";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col bg-bg">
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      <BottomTabBar />
    </div>
  );
}
