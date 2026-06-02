type Props = {
  qr: {
    qrNumber: number;
    token: string;
    status: string;
    batch: {
      batchNumber: number;
    };
  };

  size?: number;
};

export default function QrPrintCard({
  qr,
  size = 120,
}: Props) {

  const previewSize =
    size >= 180
      ? 180
      : size >= 120
      ? 120
      : 80;

  return (

    <div className="break-inside-avoid">

      <div
        className="
          border
          rounded-xl
          p-4
          bg-white
        "
      >

        <div className="flex justify-center">

          <img
            src={`/qrcodes/${qr.token}.png`}
            alt="QR"
            style={{
              width: `${previewSize}px`,
              height: `${previewSize}px`,
            }}
          />

        </div>

      </div>

      <div
        className="
          mt-2
          text-xs
          text-center
          space-y-1
        "
      >

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