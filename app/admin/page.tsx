import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  TableWrapper,
  Th,
  Td,
} from "@/components/ui/Table";

export default async function AdminPage() {

  const qrCodes = await prisma.qrCode.findMany({

    include: {
      batch: true,
    },

    orderBy: {
      qrNumber: "asc",
    },

  });

  return (

    <main className="container-page">

      <div className="flex items-center justify-between mb-6">

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

    </main>

  );

}