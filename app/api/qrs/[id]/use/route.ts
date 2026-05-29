import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const updatedQr = await prisma.qrCode.update({
      where: {
        id,
      },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
    });

    return Response.json(updatedQr);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error updating QR" },
      { status: 500 }
    );
  }
}