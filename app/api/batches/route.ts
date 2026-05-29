import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const batches = await prisma.batch.findMany({

      include: {
        qrCodes: true,
      },

      orderBy: {
        createdAt: "asc",
      },

    });

    const data = batches.map((batch) => {

      const total = batch.qrCodes.length;
      const used = batch.qrCodes.filter(qr => qr.status === "USED").length;

      return {

  	id: batch.id,

  	batchNumber: batch.batchNumber,

  	name: batch.name,

  	createdAt: batch.createdAt,

  	printedAt: batch.printedAt,

  	total,

  	used,

  	active: total - used,

	};

    });

    return Response.json(data);

  } catch (error: any) {

    console.error("BATCH ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );

  }
}