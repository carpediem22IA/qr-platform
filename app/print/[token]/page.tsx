import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import Card from "@/components/ui/Card";
import InfoSection from "@/components/ui/InfoSection";


type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PrintPage({
  params,
}: Props) {

  const { token } = await params;

  const qr = await prisma.qrCode.findUnique({

    where: {
      token,
    },

    include: {
      batch: true,
    },

  });

  if (!qr) {
    notFound();
  }

  return (

    <main className="container-page">

      <h1 className="title-page">
        Imprimir QR
      </h1>

      <Card>

        <img
          src={`/qrcodes/${qr.token}.png`}
          alt="QR"
          className="w-64 mx-auto mb-6"
        />

        <InfoSection>

          <p>
            <strong>QR:</strong>{" "}
            QR-{String(qr.qrNumber).padStart(4, "0")}
          </p>

          <p>
            <strong>Lote:</strong>{" "}
            {qr.batch?.batchNumber}
          </p>

          <p>
            <strong>Creación:</strong>{" "}
            {new Date(qr.createdAt).toLocaleString()}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            {qr.status}
          </p>

        </InfoSection>

        <PrintButton />

      </Card>

    </main>
  );
}