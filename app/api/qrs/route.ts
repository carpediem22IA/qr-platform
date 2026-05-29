import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const qrs = await prisma.qrCode.findMany({

      include: {
        batch: true,
      },

      orderBy: {
        qrNumber: "asc",
      },

    });

    return Response.json(qrs);

  } catch (error: any) {

    console.error("PRISMA ERROR:", error);

    return Response.json(
      {
        error: "Error fetching QRs",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}