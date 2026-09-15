import { prisma } from "@/lib/prisma";
import { getUserIdFromSession, getAdminIdFromSession } from "@/lib/session";

// --- 로그인 브루트포스 방어 (사용자/관리자 공통) ---
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15분

export function isLoginLocked(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

// 실패 시 다음에 저장할 시도 횟수/잠금 시각을 계산.
// 과거에 걸렸던 잠금이 이미 풀린 상태에서의 재실패라면 카운트를 0부터 새로 센다.
// (잠금이 한 번도 없었거나 아직 안 풀린 상태라면 누적)
export function nextLockoutState(
  currentAttempts: number,
  currentLockedUntil: Date | null
): { failedLoginAttempts: number; lockedUntil: Date | null } {
  const hadExpiredLock = !!currentLockedUntil && currentLockedUntil.getTime() <= Date.now();
  const attempts = (hadExpiredLock ? 0 : currentAttempts) + 1;
  if (attempts >= LOGIN_MAX_ATTEMPTS) {
    return { failedLoginAttempts: attempts, lockedUntil: new Date(Date.now() + LOGIN_LOCKOUT_MS) };
  }
  return { failedLoginAttempts: attempts, lockedUntil: null };
}

export async function getCurrentUser() {
  const userId = await getUserIdFromSession();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getCurrentAdmin() {
  const adminId = await getAdminIdFromSession();
  if (!adminId) return null;
  return prisma.admin.findUnique({ where: { id: adminId } });
}
