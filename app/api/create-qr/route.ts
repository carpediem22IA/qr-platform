import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import path from "path";

export async function POST(request: Request) {

  const body = await request.json();

  const quantity = Number(body.quantity);

  // Último QR creado
  const lastQr = await prisma.qrCode.findFirst({

    orderBy: {
      qrNumber: "desc",
    },

  });

  let currentNumber = lastQr?.qrNumber || 0;

  // Último lote creado
  const lastBatch = await prisma.batch.findFirst({

    orderBy: {
      batchNumber: "desc",
    },

  });

  // Siguiente número de lote
  const nextBatchNumber =
    lastBatch
      ? lastBatch.batchNumber + 1
      : 1;

  // Crear lote
  const batch = await prisma.batch.create({

    data: {

      batchNumber: nextBatchNumber,

      name: `LOTE-${nextBatchNumber}`,

    },

  });

  // Crear QR masivos
  const qrData = [];

  for (let i = 0; i < quantity; i++) {

    currentNumber++;

    const token = nanoid();

    const qrUrl = `http://localhost:3000/q/${token}`;

    const qrPath = path.join(
      process.cwd(),
      "public",
      "qrcodes",
      `${token}.png`
    );

    await QRCode.toFile(qrPath, qrUrl);

    qrData.push({

      qrNumber: currentNumber,

      token,

      status: "ACTIVE",

      downloadPath: "/downloads/regalo.zip",

      batchId: batch.id,

    });

  }

  await prisma.qrCode.createMany({

    data: qrData,

  });

  return Response.json({

    success: true,

    batch,

    created: quantity,

  });

}