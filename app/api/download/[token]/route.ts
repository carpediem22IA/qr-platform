import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Props
) {
  const { token } = await params;

  const qr = await prisma.qrCode.findUnique({
    where: {
      token,
    },
  });

  if (!qr) {
    return NextResponse.json(
      { error: "QR no encontrado" },
      { status: 404 }
    );
  }

  if (qr.status === "USED") {
    return NextResponse.json(
      { error: "QR ya utilizado" },
      { status: 400 }
    );
  }

  await prisma.qrCode.update({
    where: {
      token,
    },
    data: {
      status: "USED",
      usedAt: new Date(),
    },
  });

  return NextResponse.redirect(
    new URL(qr.downloadPath, request.url)
  );
}