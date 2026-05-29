import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const updatedQr = await prisma.qrCode.update({
      where: {
        id,
      },
      data: {
        status: "ACTIVE",
        usedAt: null,
      },
    });

    return Response.json(updatedQr);

  } catch (error) {
    return Response.json(
      { error: "Error resetting QR" },
      { status: 500 }
    );
  }
}