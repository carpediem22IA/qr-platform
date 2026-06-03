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
  printedAt: string | null;
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
  	  className={`
    	  border-t
    	  hover:bg-gray-50
    	  ${
           batch.printedAt
             ? "bg-gray-300 hover:bg-gray-300"
             : ""
    	  }
  	`}
       >

          <Td>
  	   <div className="flex items-center gap-2">
   	    <span>
     	      LOTE {batch.batchNumber}
    	    </span>

    	    {batch.printedAt && (
      	      <span
        	className="
          	 text-xs
          	 px-2
          	 py-0.5
          	 rounded-full
          	 bg-gray-600
          	 text-white
        	"
      	       >
        	Impreso
      	       </span>
    	     )}
  	   </div>
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