"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

// Tes composants
import DiplomeForm from "../forms/DiplomeForm";
import DiplomeView from "@/components/DiplomeView";
import ConfirmDelete from "@/components/ConfirmDelete";

export default function DiplomesPage() {
  const router = useRouter();

  // --- États (Logique V2 conservée) ---
  const [diplomes, setDiplomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false); // Changé pour matcher V1
  const [openView, setOpenView] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [refreshKey, setRefreshKey] = useState(0);

  // --- LOGIQUE API DRF ---
  const fetchDiplomes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/diplomes/");
      const data = await res.json();
      setDiplomes(data);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de charger les diplômes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomes();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/diplomes/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert("❌ Échec : " + err);
    }
  };

  return (
    // Style de fond V1 : bg-[#F3F9F5]
    <div className="p-6 space-y-4 bg-[#F3F9F5] min-h-screen">
      
      {/* Header Style V1 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A5C36]">Liste des Diplômes</h1>
        <Button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-[#0A5C36] text-white hover:bg-[#0C7041] rounded-xl shadow-sm"
        >
          + Ajouter Diplôme
        </Button>
      </div>

      {/* Loader Style V1 */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin w-6 h-6 mr-2 text-[#0A5C36]" />
          <span className="text-gray-500">Chargement...</span>
        </div>
      ) : (
        /* Table Style V1 */
        <Table className="w-full border border-[#E6F4ED] rounded-xl shadow-sm overflow-hidden bg-white">
          <TableHeader>
            <TableRow className="bg-[#E7F5EF] hover:bg-[#E7F5EF]">
              <TableHead className="w-16 text-[#0A5C36] font-semibold">ID</TableHead>
              <TableHead className="text-[#0A5C36] font-semibold">Désignation</TableHead>
              <TableHead className="text-[#0A5C36] font-semibold">Domaine</TableHead>
              <TableHead className="text-right text-[#0A5C36] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diplomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  Aucun diplôme trouvé.
                </TableCell>
              </TableRow>
            ) : (
              diplomes.map((d) => (
                <TableRow key={d.id_diplome} className="hover:bg-[#E9F7F0] transition-colors border-b border-[#F1F8F4] last:border-0">
                  <TableCell className="text-[#0A5C36]">#{d.id_diplome}</TableCell>
                  <TableCell className="text-[#0A5C36] font-medium">{d.designation}</TableCell>
                  <TableCell className="text-[#0A5C36]">
                    {d.domaine?.libdom || "N/A"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#0A5C36] border-[#0A5C36] hover:bg-[#E7F5EF]"
                      onClick={() => { setSelected(d); setOpenView(true); }}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#0A5C36] border-[#0A5C36] hover:bg-[#E7F5EF]"
                      onClick={() => { setSelected(d); setOpenForm(true); }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-100"
                      onClick={() => setConfirmDelete({ open: true, id: d.id_diplome })}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Formulaire Modal Style V1 */}
      {openForm && (
        <DiplomeForm
          diplome={selected}
          onClose={() => { setOpenForm(false); setRefreshKey(prev => prev + 1); }}
        />
      )}

      {/* View Modal Style V1 */}
      {openView && selected && (
        <DiplomeView
          diplome={selected}
          onClose={() => setOpenView(false)}
        />
      )}

      {/* Confirm Delete Style V1 */}
      {confirmDelete.open && confirmDelete.id && (
        <ConfirmDelete
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={() => { handleDelete(confirmDelete.id!); setConfirmDelete({ open: false, id: null }); }}
          title="Supprimer le Diplôme"
          message="Voulez-vous vraiment supprimer ce diplôme ?"
        />
      )}
    </div>
  );
}