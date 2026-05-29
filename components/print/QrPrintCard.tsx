type Props = {
  qr: {
    qrNumber: number;
    token: string;
    status: string;
    batch: {
      batchNumber: number;
    };
  };
};

export default function QrPrintCard({
  qr,
}: Props) {

  return (

    <div className="break-inside-avoid">

      <div className="
        border
        rounded-xl
        p-4
        bg-white
      ">

        <img
          src={`/qrcodes/${qr.token}.png`}
          alt="QR"
          className="w-full"
        />

      </div>

      <div className="
        mt-2
        text-xs
        text-center
        space-y-1
      ">

        <p>
          QR-{String(qr.qrNumber).padStart(4, "0")}
        </p>

        <p>
          Lote {qr.batch.batchNumber}
        </p>

        <p>
          {qr.status}
        </p>

      </div>

    </div>

  );

}