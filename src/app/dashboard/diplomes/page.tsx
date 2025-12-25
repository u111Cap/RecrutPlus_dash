"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DiplomeForm from "@/components/forms/DiplomeForm";
import DiplomeList from "@/components/lists/DiplomeList";

export default function DiplomesPage() {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le rafraîchissement de la liste
  const router = useRouter();

  // --- ACTIONS ---
  const handleAdd = () => {
    setEditingId(null);
    setAdding(true);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setEditingId(null);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Déclenche le useEffect de DiplomeList
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4FAF6]">
      {/* Header Style V2 (Fixe en haut) */}
      <header className="flex items-center gap-4 bg-[#E7F5EF] p-4 shadow-sm w-full fixed top-0 z-50 rounded-b-2xl border-b border-[#D1EAD9]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-[#D1EAD9] transition-all text-[#0A5C36]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#0A5C36]">Espace Académique</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col gap-6 p-6 pt-28 max-w-7xl mx-auto w-full">
        <div className="bg-white p-2 md:p-6 rounded-2xl shadow-sm border border-[#E6F4ED]">
          
          {!adding ? (
            /* On affiche la liste (Design V2) avec la logique de rafraîchissement */
            <DiplomeList 
              key={refreshKey} 
              onAdd={handleAdd} 
              onEdit={handleEdit} // Si tu veux permettre l'édition depuis la liste
            />
          ) : (
            /* Formulaire (Design V2) - On passe editId si on est en mode édition */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0A5C36]">
                  {editingId ? "Modifier le diplôme" : "Nouveau diplôme"}
                </h2>
                <p className="text-sm text-gray-500">Remplissez les informations ci-dessous</p>
              </div>
              
              <DiplomeForm 
                editId={editingId} 
                onAdded={handleSuccess} 
                onCancel={handleCancel} 
              />
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}