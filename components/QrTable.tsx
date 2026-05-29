import Link from "next/link";

type Props = {
  qrCodes: any[];
  fetchQRCodes: () => Promise<void>;
};

export default function QrTable({
  qrCodes,
  fetchQRCodes,
}: Props) {
  return (
    <div className="table-wrapper rounded-2xl overflow-hidden">
      <table className="table-base bg-white">

       <thead className="table-head">

  <tr>

    <th className="table-cell">QR</th>

    <th className="table-cell">Lote</th>

    <th className="table-cell">Creación</th>

    <th className="table-cell">Impresión</th>

    <th className="table-cell">Uso</th>

    <th className="table-cell">Estado</th>

    <th className="table-cell">Acciones</th>

  </tr>

</thead>

<tbody>

  {qrCodes.map((qr: any) => (

<tr key={qr.id} className="border-b hover:bg-gray-50">

  <td className="table-cell font-semibold">

    QR-{String(qr.qrNumber).padStart(4, "0")}

  </td>

  <td className="table-cell">

    {qr.batch?.name.replace("-", " ")}

  </td>

  <td className="table-cell text-sm">

    {new Date(qr.createdAt).toLocaleString()}

  </td>

  <td className="table-cell text-sm">

    {qr.batch?.printedAt
      ? new Date(qr.batch.printedAt).toLocaleString()
      : "Pendiente"}

  </td>

  <td className="table-cell text-sm">

    {qr.usedAt
      ? new Date(qr.usedAt).toLocaleString()
      : "Sin usar"}

  </td>

  <td className="table-cell">

    <span
      className={
        qr.status === "USED"
          ? "status-used"
          : "status-active"
      }
    >

      {qr.status === "USED"
        ? "⚫ Utilizado"
        : "🟢 Disponible"}

    </span>

  </td>

  <td className="table-cell flex gap-3">

    <a
      href={`/q/${qr.token}`}
      className="action-link action-open"
    >
      Ver
    </a>

    <button
      onClick={async () => {

        await fetch(`/api/qrs/${qr.id}/reset`, {
          method: "POST",
        });

        await fetchQRCodes();
      }}
      className="action-link action-reset"
    >
      Reset
    </button>

    <Link
     href={`/print/${qr.token}`}
     className="action-link action-print"
    >
     Imprimir QR
    </Link>

  </td>

</tr>

  ))}

</tbody>

      </table>
    </div>
  );
}