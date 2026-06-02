"use client";

import Link from "next/link";

import ShareButton from "@/components/ShareButton";

type Props = {
  backHref?: string;

  pdfUrl: string;
};

export default function PrintButton({
  backHref = "/dashboard",
  pdfUrl,
}: Props) {

  return (

  <div className="
    flex
    flex-col
    sm:flex-row
    gap-4
  ">

    <button
      onClick={() => window.print()}
      className="
        button-primary
        w-full
        sm:w-auto
      "
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
        rounded-xl
        text-center
        w-full
        sm:w-auto
      "
    >
      Descartar
    </Link>

    <ShareButton
      title="QR Platform"
      pdfUrl={pdfUrl}
    />

  </div>

);

}