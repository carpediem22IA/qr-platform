import { prisma } from "@/lib/prisma";

import Link from "next/link";

import ScrollTopButton from "@/components/ui/ScrollTopButton";

import {
  TableWrapper,
  Th,
  Td,
} from "@/components/ui/Table";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BatchPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id) {
    return (
      <main className="p-10">
        <h1>
          Batch ID no válido
        </h1>
      </main>
    );
  }

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
    return (
      <main className="p-10">
        <h1>
          Lote no encontrado
        </h1>
      </main>
    );
  }

     const totalQrs = batch.qrCodes.length;

const activeQrs =
  batch.qrCodes.filter(
    (qr) => qr.status === "ACTIVE"
  ).length;

const usedQrs =
  batch.qrCodes.filter(
    (qr) => qr.status === "USED"
  ).length;

const usageRate =
  totalQrs > 0
    ? Math.round(
        (usedQrs / totalQrs) * 100
      )
    : 0;

const lastDownload =
  batch.qrCodes
    .filter((qr) => qr.usedAt)
    .sort(
      (a, b) =>
        new Date(
          b.usedAt!
        ).getTime() -
        new Date(
          a.usedAt!
        ).getTime()
    )[0];

  return (
    <main className="container-page">
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-4
          mb-6
        "
      >
        <Link
          href="/dashboard"
          className="
            inline-block
            px-4
            py-2
            bg-white
            border
            rounded-xl
            shadow-sm
            hover:bg-gray-100
            text-center
          "
        >
          ← Volver al dashboard
        </Link>

        <Link
          href={`/print/batch/${batch.id}`}
          className="
            inline-block
            px-4
            py-2
            bg-blue-600
            text-white
            rounded-xl
            shadow-sm
            hover:bg-blue-700
            text-center
          "
        >
          Imprimir lote
        </Link>
      </div>

      {/* TÍTULO */}

      <h1 className="title-page">
        LOTE {batch.batchNumber}
      </h1>

      <div
  className="
    grid
    grid-cols-2
    lg:grid-cols-4
    gap-4
    mb-6
  "
>

  <div
    className="
      bg-white
      rounded-2xl
      shadow
      p-4
    "
  >
    <p className="text-sm text-gray-500">
      Total QR
    </p>

    <p className="text-2xl font-bold">
      {totalQrs}
    </p>
  </div>

  <div
    className="
      bg-white
      rounded-2xl
      shadow
      p-4
    "
  >
    <p className="text-sm text-gray-500">
      Activos
    </p>

    <p className="text-2xl font-bold">
      {activeQrs}
    </p>
  </div>

  <div
    className="
      bg-white
      rounded-2xl
      shadow
      p-4
    "
  >
    <p className="text-sm text-gray-500">
      Usados
    </p>

    <p className="text-2xl font-bold">
      {usedQrs}
    </p>
  </div>

  <div
    className="
      bg-white
      rounded-2xl
      shadow
      p-4
    "
  >
    <p className="text-sm text-gray-500">
      Uso %
    </p>

    <p className="text-2xl font-bold">
      {usageRate}%
    </p>
  </div>

</div>

      <p
  className="
    text-sm
    text-gray-500
    mb-6
  "
>
  QR
  {String(
    batch.qrCodes[0]?.qrNumber
  ).padStart(4, "0")}
  {" "}al{" "}
  QR
  {String(
    batch.qrCodes[
      batch.qrCodes.length - 1
    ]?.qrNumber
  ).padStart(4, "0")}
  {" · "}
  Total: {batch.qrCodes.length} QR's
</p>

<div
  className="
    bg-white
    rounded-2xl
    shadow-sm
    p-4
    mb-8
  "
>
  <p className="text-sm">
    <strong>
      Impreso:
    </strong>
    {" "}
    {batch.printedAt
      ? new Date(
          batch.printedAt
        ).toLocaleString()
      : "Pendiente"}
  </p>

  <p className="text-sm mt-2">
    <strong>
      Último Uso:
    </strong>
    {" "}
    {lastDownload?.usedAt
      ? new Date(
          lastDownload.usedAt
        ).toLocaleString()
      : "Sin descargas"}
  </p>
</div>

      {/* EXPORTAR PDF */}

      <div
        className="
          mt-8
          border
          rounded-2xl
          p-6
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Exportar PDF
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Selecciona el tamaño de
              los códigos QR
            </p>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >
          {/* PEQUEÑO */}

          <a
            href={`/print/batch/${batch.id}?size=80`}
            target="_blank"
            className="
              border
              rounded-2xl
              p-5
              hover:border-black
              hover:shadow-md
              transition
              bg-gray-50
            "
          >
            <div
              className="
                text-lg
                font-semibold
                mb-2
              "
            >
              PDF pequeño
            </div>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Más QR por página.
              Ideal para pegatinas y
              formatos compactos.
            </p>

            <div
              className="
                mt-4
                text-sm
                font-medium
              "
            >
              Tamaño: 80px
            </div>
          </a>

          {/* MEDIANO */}

          <a
            href={`/print/batch/${batch.id}?size=120`}
            target="_blank"
            className="
              border-2
              border-blue-600
              rounded-2xl
              p-5
              hover:shadow-md
              transition
              bg-blue-50
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >
              <div
                className="
                  text-lg
                  font-semibold
                "
              >
                PDF mediano
              </div>

              <span
                className="
                  text-xs
                  bg-blue-600
                  text-white
                  px-2
                  py-1
                  rounded-full
                "
              >
                Recomendado
              </span>
            </div>

            <p
              className="
                text-sm
                text-gray-600
              "
            >
              Equilibrio perfecto entre
              tamaño y cantidad de QR.
            </p>

            <div
              className="
                mt-4
                text-sm
                font-medium
              "
            >
              Tamaño: 120px
            </div>
          </a>

          {/* GRANDE */}

          <a
            href={`/print/batch/${batch.id}?size=180`}
            target="_blank"
            className="
              border
              rounded-2xl
              p-5
              hover:border-black
              hover:shadow-md
              transition
              bg-gray-50
            "
          >
            <div
              className="
                text-lg
                font-semibold
                mb-2
              "
            >
              PDF grande
            </div>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              QR grandes para lectura
              lejana o impresión
              destacada.
            </p>

            <div
              className="
                mt-4
                text-sm
                font-medium
              "
            >
              Tamaño: 180px
            </div>
          </a>
        </div>
      </div>

      {/* DESKTOP */}

      <div className="hidden md:block mt-8">
        <TableWrapper>
          <thead>
            <tr>
              <Th>QR</Th>

              <Th>Token</Th>

              <Th>Estado</Th>

              <Th>Creado</Th>

              <Th>Usado</Th>

              {/* <Th>Archivo</Th> */}
            </tr>
          </thead>

          <tbody>
            {batch.qrCodes.map((qr) => (
              <tr
                key={qr.id}
                className="
                  border-t
                  hover:bg-gray-50
                "
              >
                <Td>
                  {qr.qrNumber}
                </Td>

                <Td>
                  <span
                    className="
                      font-mono
                      text-sm
                    "
                  >
                    {qr.token}
                  </span>
                </Td>

                <Td>
  <div className="flex items-center gap-2">
    <span
      className={`w-3 h-3 rounded-full ${
        qr.status === "ACTIVE"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    />

    <span className="text-sm">
      {qr.status === "ACTIVE"
        ? "Activo"
        : "USED"}
    </span>
  </div>
</Td>

                <Td>
                  {new Date(
                    qr.createdAt
                  ).toLocaleString()}
                </Td>

                <Td className="text-center">
  {qr.usedAt
    ? new Date(qr.usedAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-"}
</Td>

                {/*
<Td>
  {qr.downloadPath || "-"}
</Td>
*/}
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      </div>

      {/* MOBILE */}

      <div
        className="
          block
          md:hidden
          space-y-4
          mt-8
        "
      >
        {batch.qrCodes.map((qr) => (
          <div
            key={qr.id}
            className="
              bg-white
              rounded-2xl
              shadow
              p-4
            "
          >
            <p
              className="
                text-lg
                font-semibold
              "
            >
              QR-
              {String(qr.qrNumber)
                .padStart(4, "0")}
            </p>

            <p
              className="
                text-sm
                text-gray-500
                mt-2
              "
            >
              {qr.status}
            </p>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {qr.usedAt
                ? new Date(
                    qr.usedAt
                  ).toLocaleString()
                : "No usado"}
            </p>

            <div
              className="
                mt-4
                flex
                gap-2
              "
            >
              <Link
                href={`/print/${qr.token}`}
                className="
                  button-primary
                  flex-1
                  text-center
                "
              >
                Imprimir
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ScrollTopButton />
    </main>
  );
}