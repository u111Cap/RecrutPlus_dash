"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Edit3, Trash2, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import CandidatForm from "@/components/forms/CandidatForm";

interface Candidat {
  id_candidat: number;
  nom_cand: string;
  pren_cand: string;
  genre: string;
  dat_nais: string;
  lieu_nais: string;
  telephone1: string;
  telephone2?: string;
  email: string;
  photo?: string | null;
  sitmat?: string;
  diplome?: number | null;
}

export default function CandidatList({ onAdd }: { onAdd: () => void }) {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/candidats/");
      setCandidats(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les candidats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const deleteCandidat = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce candidat ?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/candidats/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      toast.success("Candidat supprimé !");
      fetchCandidats();
    } catch (error) {
      console.error(error);
      toast.error("Échec de la suppression");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="animate-spin w-6 h-6 mr-2 text-blue-500" />
      Chargement...
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">Liste des Candidats</h2>
        <Button onClick={onAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="w-4 h-4" />
          Ajouter Candidat
        </Button>
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead>Photo</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {candidats.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucun candidat trouvé.
              </TableCell>
            </TableRow>
          )}

          {candidats.map((c) =>
            editingId === c.id_candidat ? (
              <TableRow key={c.id_candidat}>
                <TableCell colSpan={7}>
                  <CandidatForm
                    editId={c.id_candidat}
                    onAdded={() => { setEditingId(null); fetchCandidats(); }}
                    onCancel={() => setEditingId(null)}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={c.id_candidat} className="hover:bg-gray-50 transition-colors">
                <TableCell>
                  {c.photo ? (
                    <img src={c.photo} alt={c.nom_cand} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{c.nom_cand}</TableCell>
                <TableCell>{c.pren_cand}</TableCell>
                <TableCell>{c.genre || "-"}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telephone1}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(c.id_candidat)}>
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteCandidat(c.id_candidat)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
