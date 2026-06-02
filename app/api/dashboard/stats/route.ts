import { prisma } from "@/lib/prisma";

export async function GET() {

  const totalBatches =
    await prisma.batch.count();

  const totalQrs =
    await prisma.qrCode.count();

  const activeQrs =
    await prisma.qrCode.count({
      where: {
        status: "ACTIVE",
      },
    });

  const usedQrs =
    await prisma.qrCode.count({
      where: {
        status: "USED",
      },
    });

  const usageRate =
    totalQrs > 0
      ? Math.round(
          (usedQrs / totalQrs) * 100
        )
      : 0;

  return Response.json({
    totalBatches,
    totalQrs,
    activeQrs,
    usedQrs,
    usageRate,
  });

}