import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  TableWrapper,
  Th,
  Td,
} from "@/components/ui/Table";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminPage({
  searchParams,
}: Props) {

  const params = await searchParams;

  const page = Number(params.page || "1");

  const limit = 10;

  const skip = (page - 1) * limit;

  const totalQrs = await prisma.qrCode.count();

  const totalPages = Math.ceil(
    totalQrs / limit
  );

  const qrCodes = await prisma.qrCode.findMany({

    include: {
      batch: true,
    },

    orderBy: {
      qrNumber: "asc",
    },

    skip,

    take: limit,

  });

  return (

    <main className="container-page">

      <div className="
        flex
        items-center
        justify-between
        mb-6
      ">

        <h1 className="title-page">
          Panel Admin
        </h1>

        <Link
          href="/dashboard"
          className="
            px-4
            py-2
            bg-white
            border
            rounded-xl
            shadow-sm
            hover:bg-gray-100
          "
        >
          ← Dashboard
        </Link>

      </div>

      <p className="text-sm text-gray-500 mb-3">

  	QR {String(qrCodes[0]?.qrNumber).padStart(4, "0")}
  	   {" "}al{" "}
  	   QR {String(
    	   qrCodes[qrCodes.length - 1]?.qrNumber
    	   ).padStart(4, "0")}

      </p>

      <TableWrapper>

        <thead>

          <tr>

            <Th>QR</Th>
            <Th>Lote</Th>
            <Th>Estado</Th>
            <Th>Token</Th>
            <Th>Creado</Th>
            <Th>Usado</Th>
            <Th>Archivo</Th>

          </tr>

        </thead>

        <tbody>

          {qrCodes.map((qr) => (

            <tr
              key={qr.id}
              className="border-t hover:bg-gray-50"
            >

              <Td>
                QR-{String(qr.qrNumber).padStart(4, "0")}
              </Td>

              <Td>
                LOTE {qr.batch?.batchNumber}
              </Td>

              <Td>
                {qr.status}
              </Td>

              <Td className="font-mono text-sm">
                {qr.token}
              </Td>

              <Td>
                {new Date(qr.createdAt).toLocaleString()}
              </Td>

              <Td>

                {qr.usedAt
                  ? new Date(qr.usedAt).toLocaleString()
                  : "No usado"}

              </Td>

              <Td>
                {qr.downloadPath || "-"}
              </Td>

            </tr>

          ))}

        </tbody>

      </TableWrapper>

      <div className="
        flex
        items-center
        justify-center
        gap-4
        mt-8
      ">

        {page > 1 && (

          <Link
            href={`/admin?page=${page - 1}`}
            className="
              px-4
              py-2
              bg-white
              border
              rounded-xl
              shadow-sm
              hover:bg-gray-100
            "
          >
            ← Anterior
          </Link>

        )}

        <span className="text-sm">

          Página {page} de {totalPages}

        </span>

        {page < totalPages && (

          <Link
            href={`/admin?page=${page + 1}`}
            className="
              px-4
              py-2
              bg-white
              border
              rounded-xl
              shadow-sm
              hover:bg-gray-100
            "
          >
            Siguiente →
          </Link>

        )}

      </div>

    </main>

  );

}