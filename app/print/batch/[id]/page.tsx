import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";

import Link from "next/link";

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

  // ==============================================
  // ETIQUETA TAMAÑO
  // ==============================================

  const sizeLabel =
    qrSize >= 180
      ? "Grande"
      : qrSize >= 120
      ? "Mediano"
      : "Pequeño";

  // ==============================================
  // OBTENER LOTE
  // ==============================================

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

  // ==============================================
  // URL PDF
  // ==============================================

  const pdfUrl =
    `/api/batches/${batch.id}/pdf?size=${qrSize}`;

  return (

    <main className="container-page">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="print:hidden">

        <h1 className="title-page">

          Imprimir lote {batch.batchNumber}

        </h1>

        <p className="mb-2">

          Total QR: {batch.qrCodes.length}

        </p>

        <p
          className="
            mb-6
            text-sm
            text-gray-500
          "
        >

          Tamaño seleccionado:
          {" "}

          <span className="font-semibold">

            [{sizeLabel}]

          </span>

          {" "}

          {qrSize}px

        </p>

        {/* ====================================== */}
        {/* BOTONES PRINCIPALES */}
        {/* ====================================== */}

        <div className="mb-4">

          <PrintButton
            backHref={`/dashboard/batch/${batch.id}`}
            pdfUrl={pdfUrl}
          />

        </div>

        {/* ====================================== */}
        {/* ACCIONES SECUNDARIAS */}
        {/* ====================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
            text-sm
            text-gray-500
            mb-10
          "
        >

          <a
            href={pdfUrl}
            target="_blank"
            className="
              hover:text-black
              transition
            "
          >
            Abrir PDF
          </a>

          <span>·</span>

          <a
            href={pdfUrl}
            download
            className="
              hover:text-black
              transition
            "
          >
            Descargar PDF
          </a>

        </div>

      </div>

      {/* ========================================== */}
      {/* GRID QR */}
      {/* ========================================== */}

      <div
        className="
          grid
          grid-cols-3
          gap-6
        "
      >

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

      {/* ========================================== */}
      {/* VOLVER */}
      {/* ========================================== */}

      <div
        className="
          print:hidden
          mt-12
          flex
          justify-center
        "
      >

        <Link
          href={`/dashboard/batch/${batch.id}`}
          className="
            text-sm
            text-gray-500
            hover:text-black
            transition
          "
        >
          ← Volver al lote
        </Link>

      </div>

    </main>

  );

}