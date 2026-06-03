"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import BatchTable from "@/components/BatchTable";

export default function DashboardPage() {

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(10);

  const [stats, setStats] = useState({
  totalBatches: 0,
  totalQrs: 0,
  activeQrs: 0,
  usedQrs: 0,
  usageRate: 0,
});

  // Cargar batches
  const fetchBatches = async () => {

    try {

      const res = await fetch("/api/batches");

      const data = await res.json();

      console.log("BATCH DATA:", data);

      if (Array.isArray(data)) {

        setBatches(data);

      } else {

        console.error("API ERROR:", data);

        setBatches([]);

      }

    } catch (error) {

      console.error(error);

      setBatches([]);

    }

  };

   const fetchStats = async () => {

   try {

     const res =
       await fetch("/api/dashboard/stats");

     const data =
       await res.json();

     setStats(data);

   } catch (error) {

     console.error(error);

   }

 };

  // useEffect FUERA de funciones
  useEffect(() => {

    fetchBatches();
    fetchStats();

  }, []);

  // Crear lote
  const createQR = async () => {

    setLoading(true);

    await fetch("/api/create-qr", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        quantity,
      }),

    });

    await fetchBatches();
    await fetchStats();

    setLoading(false);

  };

  return (

    <main className="container-page">

      <h1 className="title-page">
        Dashboard QR
      </h1>

      <div
  className="
    grid
    grid-cols-2
    lg:grid-cols-5
    gap-4
    mb-8
  "
>

  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-sm text-gray-500">
      Lotes
    </p>

    <p className="text-2xl font-bold">
      {stats.totalBatches}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-sm text-gray-500">
      QR Totales
    </p>

    <p className="text-2xl font-bold">
      {stats.totalQrs}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-sm text-gray-500">
      Activos
    </p>

    <p className="text-2xl font-bold">
      {stats.activeQrs}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-sm text-gray-500">
      Usados
    </p>

    <p className="text-2xl font-bold">
      {stats.usedQrs}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-sm text-gray-500">
      Uso %
    </p>

    <p className="text-2xl font-bold">
      {stats.usageRate}%
    </p>
  </div>

</div>

      <div className="
        flex
        flex-col
        sm:flex-row
        gap-4
        mb-6
      ">

        <select
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          className="
            border
            px-3
            py-2
            rounded
            bg-white
            w-full
            sm:w-auto
          "
        >

          <option value={10}>10 QR</option>
          <option value={20}>20 QR</option>
          <option value={30}>30 QR</option>
          <option value={40}>40 QR</option>
          <option value={50}>50 QR</option>

        </select>

        <button
          onClick={createQR}
          className="
            button-primary
            w-full
            sm:w-auto
          "
          disabled={loading}
        >

          {loading
            ? "Generando..."
            : "Generar lote"}

        </button>

        <Link
          href="/admin"
          className="
            px-4
            py-2
            bg-white
            border
            rounded-xl
            shadow-sm
            hover:bg-gray-100
            text-center
            w-full
            sm:w-auto
          "
        >
          Panel Admin
        </Link>

      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">

        <BatchTable batches={batches} />

      </div>

      {/* MOBILE */}
<div className="block md:hidden space-y-4">

  {batches.map((batch: any) => (

    <div
      key={batch.id}
      className="
        bg-white
        rounded-2xl
        shadow
        p-4
      "
    >

      <p
        className="
          text-lg
          font-semibold
        "
      >
        LOTE {batch.batchNumber}
      </p>

      {batch.printedAt && (

        <p
          className="
            inline-block
            mt-2
            px-2
            py-1
            text-xs
            font-bold
            rounded
            bg-gray-500
            text-white
          "
        >
          IMPRESO
        </p>

      )}

      <p
        className="
          text-sm
          text-gray-500
          mt-1
        "
      >
        QR
        {String(batch.firstQr)
          .padStart(4, "0")}

        {" "}al{" "}

        QR
        {String(batch.lastQr)
          .padStart(4, "0")}
      </p>

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        Total: {batch.total} QR's
      </p>

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        Activos: {batch.active}
      </p>

      <div className="mt-4">

        <Link
          href={`/dashboard/batch/${batch.id}`}
          className="
            button-primary
            w-full
            inline-block
            text-center
          "
        >
          Ver lote
        </Link>

      </div>

    </div>

  ))}

</div>

    </main>

  );

}