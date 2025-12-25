"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import ConfirmDelete from "../ConfirmDelete";
import CampagneView from "../CampagneView";
import { toast } from "sonner";

interface CampagneListProps {
  onAdd: () => void;
  onEdit: (campagne: any) => void;
}

export default function CampagneList({ onAdd, onEdit }: CampagneListProps) {
  const [campagnes, setCampagnes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const API_URL = "http://127.0.0.1:8000/api/campagnes/";

  const fetchCampagnes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCampagnes(res.data);
    } catch (error) {
      console.error("Erreur de chargement des campagnes:", error);
      toast.error("Impossible de charger les campagnes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}${deleteTarget.cod_anne}/`);
      toast.success("✅ Campagne supprimée !");
      setDeleteTarget(null);
      fetchCampagnes();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      toast.error("❌ Impossible de supprimer la campagne.");
    }
  };

  return (
    <div className="overflow-x-auto bg-[#F3F9F5] p-6 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0A5C36]">Liste des Campagnes</h2>

        <Button
          onClick={onAdd}
          className="rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          ➕ Ajouter Campagne
        </Button>
      </div>

      {/* LOADER */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-[#0A5C36]" />
        </div>
      ) : (
        <Table className="w-full rounded-xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white table-fixed">
          <TableHeader>
            <TableRow className="bg-[#E7F5EF]">
              <TableHead className="font-bold text-[#0A5C36] w-[100px]">ID</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Description</TableHead>
              <TableHead className="font-bold text-[#0A5C36] w-[150px]">Date Début</TableHead>
              <TableHead className="font-bold text-[#0A5C36] w-[150px]">Date Fin</TableHead>
              <TableHead className="font-bold text-[#0A5C36] w-[100px]">État</TableHead>
              <TableHead className="text-right font-bold text-[#0A5C36] w-[250px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {campagnes.length > 0 ? (
              campagnes.map((c) => (
                <TableRow 
                  key={c.cod_anne} 
                  className="hover:bg-[#E7F5EF] transition-colors border-b border-[#F1F8F4] last:border-0"
                >
                  <TableCell className="font-medium text-[#0A5C36]">{c.cod_anne}</TableCell>
                  
                  {/* CELLULE DESCRIPTION CORRIGÉE */}
                  <TableCell 
                    className="max-w-xs truncate" 
                    title={c.description} // Affiche le texte complet au survol
                  >
                    {c.description}
                  </TableCell>

                  <TableCell>{c.dat_debut ? new Date(c.dat_debut).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>{c.dat_fin ? new Date(c.dat_fin).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#E7F5EF] text-[#0A5C36]">
                      {c.etat}
                    </span>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedView(c)}
                      className="rounded-xl border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF]"
                    >
                      Voir
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(c)}
                      className="rounded-xl border-[#E6F4ED] hover:bg-[#E7F5EF] text-gray-700"
                    >
                      Modifier
                    </Button>

                    <Button
                      size="sm"
                      className="rounded-xl bg-[#D72638] hover:bg-[#B51F2E] text-white shadow-sm"
                      onClick={() => setDeleteTarget(c)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                  Aucune campagne trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Modals */}
      {selectedView && (
        <CampagneView
          campagne={selectedView}
          onClose={() => setSelectedView(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          open={true}
          title="Confirmer la suppression"
          message={`Voulez-vous vraiment supprimer la campagne : "${deleteTarget.description}" ?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}