import Link from "next/link";

import {
  TableWrapper,
  Th,
  Td,
} from "@/components/ui/Table";

type Batch = {
  id: string;
  batchNumber: number;
  name: string;
  total: number;
  active: number;
  used: number;
  createdAt: string;
};

export default function BatchTable({
  batches,
}: {
  batches: Batch[];
}) {

  return (

  <TableWrapper>

    <thead>

      <tr>

        <Th>Lote</Th>
        <Th>Total</Th>
        <Th>Activos</Th>
        <Th>Usados</Th>
        <Th>Creado</Th>
        <Th>Acciones</Th>

      </tr>

    </thead>

    <tbody>

      {batches.map((batch) => (

        <tr
          key={batch.id}
          className="border-t hover:bg-gray-50"
        >

          <Td>
            LOTE {batch.batchNumber}
          </Td>

          <Td>
            {batch.total}
          </Td>

          <Td>
            {batch.active}
          </Td>

          <Td>
            {batch.used}
          </Td>

          <Td>
            {new Date(batch.createdAt).toLocaleString()}
          </Td>

          <Td>

            <Link
              href={`/dashboard/batch/${batch.id}`}
              className="text-blue-600 underline"
            >
              Ver lote
            </Link>

          </Td>

        </tr>

      ))}

    </tbody>

  </TableWrapper>

);
}