import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function QrPage({ params }: Props) {
  const { token } = await params;

  const qr = await prisma.qrCode.findUnique({
    where: {
      token,
    },
  });

  if (!qr) {
    notFound();
  }

  if (qr.status === "USED") {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          QR ya utilizado
        </h1>
      </main>
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

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Descarga disponible
      </h1>

      <a
        href={qr.downloadPath}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Descargar archivo
      </a>
    </main>
  );
}