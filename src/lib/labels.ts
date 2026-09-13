import type { ApplicationMethod } from "@/generated/prisma/enums";

export const METHOD_LABEL: Record<ApplicationMethod, string> = {
  DRIP: "관주식 양액공급",
  FOLIAR: "엽면살포",
};

export function formatMonthDay(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
