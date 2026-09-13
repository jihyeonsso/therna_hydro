import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "ThermaVita Hydro",
      ingredientSummary:
        "유산균 발효 유래 기능성 대사산물 (젖산·항균물질·펩타이드 등) — 정식 원료 설명은 부티릭스 확인 후 갱신 예정",
      filtrationNote: "여과·정제 처리 — 침전·노즐막힘 방지",
      phEcStabilityNote: "pH·EC 안정성 확보 제형",
    },
  });

  await prisma.heatTimingGuide.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      content:
        "고온기 이전 선제적 적용이 중요합니다. 정확한 리드타임은 부티릭스 현장 실증 데이터 확보 후 확정 예정입니다.",
    },
  });

  const notices = [
    { title: "폭염 대비 사용법 업데이트 안내", body: "본문 준비 중입니다." },
    { title: "서비스 오픈 안내", body: "ThermaVita Hydro 사용 가이드 앱이 오픈했습니다." },
  ];
  for (const n of notices) {
    const existing = await prisma.notice.findFirst({ where: { title: n.title } });
    if (!existing) {
      await prisma.notice.create({ data: n });
    }
  }

  const demoEmail = "demo@example.com";
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: "홍길동",
        passwordHash: await hash("password123", 10),
      },
    });

    const kale = await prisma.registeredCrop.create({
      data: { userId: user.id, cropName: "케일", method: "DRIP" },
    });
    await prisma.schedule.create({
      data: {
        registeredCropId: kale.id,
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        repeatRule: "매주",
      },
    });
    await prisma.usageHistory.create({
      data: {
        registeredCropId: kale.id,
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    const lettuce = await prisma.registeredCrop.create({
      data: { userId: user.id, cropName: "상추", method: "FOLIAR" },
    });
    await prisma.usageHistory.create({
      data: {
        registeredCropId: lettuce.id,
        appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash: await hash("admin1234", 10),
        role: "OWNER",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
