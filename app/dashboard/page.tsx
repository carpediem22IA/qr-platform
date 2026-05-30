"use client";

import { useEffect, useState } from "react";
import BatchTable from "@/components/BatchTable";
import Link from "next/link";

export default function DashboardPage() {

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(10);

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

  // useEffect FUERA de funciones
  useEffect(() => {
    fetchBatches();
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

    setLoading(false);
  };

  return (

    <main className="container-page">

      <h1 className="title-page">
        Dashboard QR
      </h1>

      <div className="flex gap-4 mb-6">

        <select
  	 id="quantity"
  	 name="quantity"
  	 value={quantity}
  	 onChange={(e) =>
    	  setQuantity(Number(e.target.value))
  	}
  	 className="border px-3 py-2 rounded bg-white"
	>

  <option value={10}>10 QR</option>
  <option value={20}>20 QR</option>
  <option value={30}>30 QR</option>
  <option value={40}>40 QR</option>
  <option value={50}>50 QR</option>
</select>
        <button
          onClick={createQR}
          className="button-primary"
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
  	 "
        >
  	 Panel Admin
	</Link>

      </div>

      <BatchTable batches={batches} />

    </main>
  );
}