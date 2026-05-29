import { prisma } from "@/lib/prisma";

import Link from "next/link";

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

export default async function BatchPage({ params }: Props) {

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

  return (

    <main className="container-page">

      <Link
        href="/dashboard"
        className="
          inline-block
          mb-4
          px-4
          py-2
          bg-white
          border
          rounded-xl
          shadow-sm
          hover:bg-gray-100
        "
      >
        ← Volver al dashboard
      </Link>

      <Link
  	href={`/print/batch/${batch.id}`}
  	className="
    	inline-block
    	mb-6
    	ml-4
    	px-4
    	py-2
    	bg-blue-600
    	text-white
    	rounded-xl
    	shadow-sm
    	hover:bg-blue-700
  	"
	>
  	Imprimir lote
      </Link>

      <h1 className="title-page">

        LOTE {batch.batchNumber}

      </h1>

      <p className="mb-6">

        Total QR: {batch.qrCodes.length}

      </p>

      <TableWrapper>

        <thead>

          <tr>

            <Th>QR</Th>

            <Th>Token</Th>

            <Th>Estado</Th>

            <Th>Creado</Th>

            <Th>Usado</Th>

            <Th>Archivo</Th>

          </tr>

        </thead>

        <tbody>

          {batch.qrCodes.map((qr) => (

            <tr
              key={qr.id}
              className="border-t hover:bg-gray-50"
            >

              <Td>
                {qr.qrNumber}
              </Td>

              <Td>

                <span className="font-mono text-sm">

                  {qr.token}

                </span>

              </Td>

              <Td>
                {qr.status}
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