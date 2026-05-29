"use client";

import Link from "next/link";

type Props = {
  backHref?: string;
};

export default function PrintButton({
  backHref = "/dashboard",
}: Props) {

  return (

    <div className="flex gap-4">

      <button
        onClick={() => window.print()}
        className="button-primary"
      >
        Imprimir
      </button>

      <Link
        href={backHref}
        className="
          border
          border-gray-300
          px-4
          py-2
          rounded
        "
      >
        Descartar
      </Link>

    </div>

  );

}