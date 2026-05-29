import Link from "next/link";
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
      <main className="p-10 flex flex-col gap-4">

        <Link
          href="/dashboard"
          className="text-blue-600 underline"
        >
          ← Volver al dashboard
        </Link>

        <h1 className="text-3xl font-bold">
          QR ya utilizado
        </h1>

      </main>
    );
  }

  return (
    <main className="p-10 flex flex-col gap-4">

      <Link
        href="/dashboard"
        className="text-blue-600 underline"
      >
        ← Volver al dashboard
      </Link>

      <h1 className="text-3xl font-bold">
        Descarga disponible
      </h1>

      <a
        href={`/api/download/${qr.token}`}
        className="bg-black text-white px-4 py-2 rounded w-fit"
      >
        Descargar archivo
      </a>

    </main>
  );
}