"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DomaineForm from "@/components/forms/DomaineForm";
import DomaineList from "@/components/lists/DomaineList";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000/api/domaines/";

export default function DomainesPage() {
  const router = useRouter();

  const [adding, setAdding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch API
  const fetchDomaines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setDomaines(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les domaines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomaines();
  }, [refreshKey]);

  const handleAdd = () => setAdding(true);
  const handleCancel = () => setAdding(false);
  const handleAdded = () => {
    setRefreshKey((prev) => prev + 1);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-4 bg-[#E7F5EF] p-4 shadow-md w-full fixed top-0 z-50 rounded-b-lg">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-[#D1EAD9] transition"
        >
          <ArrowLeft className="w-6 h-6 text-[#0A5C36]" />
        </button>
        <h1 className="text-2xl font-bold text-[#0A5C36]">Gestion des Domaines</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col gap-6 p-6 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6 border border-[#E6F4ED]">
          {!adding ? (
            <DomaineList
              domaines={domaines}
              loading={loading}
              onAdd={handleAdd}
              onRefresh={() => setRefreshKey((k) => k + 1)}
            />
          ) : (
            <DomaineForm onAdded={handleAdded} onCancel={handleCancel} />
          )}
        </div>
      </main>
    </div>
  );
}
