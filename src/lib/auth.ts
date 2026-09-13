import { prisma } from "@/lib/prisma";
import { getUserIdFromSession, getAdminIdFromSession } from "@/lib/session";

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
