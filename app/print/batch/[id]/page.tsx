import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";

import PrintButton from "@/components/PrintButton";

import QrPrintCard from "@/components/print/QrPrintCard";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    size?: string;
  }>;
};

export default async function PrintBatchPage({
  params,
  searchParams,
}: Props) {

  const { id } = await params;

  const { size } =
    await searchParams;

  const qrSize =
    Number(size) || 120;

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

  const pdfUrl =
    `/api/batches/${batch.id}/pdf?size=${qrSize}`;

  return (

    <main className="container-page">

      <div className="print:hidden">

        <h1 className="title-page">

          Imprimir lote {batch.batchNumber}

        </h1>

        <p className="mb-2">

          Total QR: {batch.qrCodes.length}

        </p>

        <p className="mb-6 text-sm text-gray-500">

          Tamaño seleccionado:
          {" "}
          {qrSize}px

        </p>

        <div
          className="
            flex
            flex-wrap
            gap-4
            mb-8
          "
        >

          <PrintButton
            backHref={`/dashboard/batch/${batch.id}`}
          />

          <a
            href={pdfUrl}
            target="_blank"
            className="
              px-4
              py-2
              rounded-xl
              border
              bg-white
              hover:bg-gray-100
              shadow-sm
            "
          >
            Abrir PDF
          </a>

          <a
            href={pdfUrl}
            download
            className="
              px-4
              py-2
              rounded-xl
              border
              bg-white
              hover:bg-gray-100
              shadow-sm
            "
          >
            Descargar PDF
          </a>

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