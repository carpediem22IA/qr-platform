import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

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

  } catch (error: any) {

    console.error(
      "STATS ERROR:",
      error
    );

    return Response.json(
      {
        error: error.message,
        stack: error.stack,
      },
      {
        status: 500,
      }
    );

  }

}