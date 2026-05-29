import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";

import PrintButton from "@/components/PrintButton";

import QrPrintCard from "@/components/print/QrPrintCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintBatchPage({
  params,
}: Props) {

  const { id } = await params;

  const batch = await prisma.batch.findUnique({

    where: {
      id,
    },

    include: {

      qrCodes: {

        orderBy: {
          qrNumber: "asc",
        },

      },

    },

  });

  if (!batch) {
    notFound();
  }

  return (

    <main className="container-page">

      <div className="print:hidden">

        <h1 className="title-page">

          Imprimir lote {batch.batchNumber}

        </h1>

        <p className="mb-6">

          Total QR: {batch.qrCodes.length}

        </p>

        <div className="mb-8">

          <PrintButton
            backHref={`/dashboard/batch/${batch.id}`}
          />

        </div>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {batch.qrCodes.map((qr) => (

          <QrPrintCard
            key={qr.id}
            qr={{
              qrNumber: qr.qrNumber,
              token: qr.token,
              status: qr.status,
              batch: {
                batchNumber: batch.batchNumber,
              },
            }}
          />

        ))}

      </div>

    </main>

  );

}