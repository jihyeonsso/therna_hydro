import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, cropCount, scheduleCount, historyCount, noticeCount, guideCount] = await Promise.all([
    prisma.user.count(),
    prisma.registeredCrop.count(),
    prisma.schedule.count(),
    prisma.usageHistory.count(),
    prisma.notice.count(),
    prisma.guideContent.count(),
  ]);

  const stats = [
    { label: "가입 사용자", value: userCount },
    { label: "등록 작물 카드", value: cropCount },
    { label: "등록된 일정", value: scheduleCount },
    { label: "기록된 이력", value: historyCount },
    { label: "공지사항", value: noticeCount },
    { label: "가이드 콘텐츠(작물×방법)", value: guideCount },
  ];

  return (
    <div>
      <h1 className="mb-5 text-xl font-black text-text">이용 현황</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
            <div className="text-[12px] font-semibold text-text-muted">{s.label}</div>
            <div className="mt-2 text-3xl font-black text-primary">{s.value}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-text-faint">
        * 스캔 횟수·접속자 수 등 실시간 이용 통계는 운영 데이터 수집 로직 추가 구현 필요(2차).
      </p>
    </div>
  );
}
