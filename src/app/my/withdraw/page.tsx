import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { destroyUserSession } from "@/lib/session";
import { BackHeader } from "@/components/BackHeader";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

export default async function WithdrawPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/my/withdraw");
  const userId = user.id;

  async function withdraw() {
    "use server";
    // FarmProfile / RegisteredCrop(+Schedule/UsageHistory)는 스키마의 onDelete: Cascade로 함께 삭제됨
    await prisma.user.delete({ where: { id: userId } });
    await destroyUserSession();
    redirect("/?notice=withdrawn");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <BackHeader title="회원 탈퇴" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="text-[13px] leading-relaxed text-text-muted">
          탈퇴 시 등록된 작물, 일정, 이력 정보가 모두 삭제되며 복구할 수 없습니다.
        </div>
        <form action={withdraw}>
          <ConfirmSubmitButton
            confirmMessage="정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 되돌릴 수 없습니다."
            pendingText="탈퇴 처리 중..."
            className="flex h-[52px] w-full items-center justify-center rounded-[10px] border border-danger text-[15px] font-bold text-danger"
          >
            탈퇴하기
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
