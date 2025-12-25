"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, User, Eye, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CandidatView from "../CandidatView";

// Interface alignée sur l'API Django (V2)
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

interface CandidatListProps {
  onAdd: () => void;
  onEdit: (candidat: Candidat) => void;
}

export default function CandidatList({ onAdd, onEdit }: CandidatListProps) {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidat | null>(null);
  const [viewing, setViewing] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/candidats/";

  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCandidats(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Impossible de charger les candidats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce candidat ?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("✅ Candidat supprimé !");
      fetchCandidats();
    } catch (err) {
      console.error(err);
      toast.error("❌ Échec de la suppression.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-[#0A5C36]" />
        <span className="ml-3 text-gray-500 font-medium">Chargement des candidats...</span>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header - Style V1 */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#0A5C36]">Liste des Candidats</h2>
        <Button
          onClick={onAdd}
          className="rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          ➕ Ajouter Candidat
        </Button>
      </div>

      {/* Table - Style V1 avec Photo V2 */}
      <div className="rounded-2xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E7F5EF] hover:bg-[#E7F5EF]">
              <TableHead className="font-bold text-[#0A5C36] w-20">Photo</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Nom & Prénom</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Genre</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Email</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Téléphone</TableHead>
              <TableHead className="text-right font-bold text-[#0A5C36]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                  Aucun candidat trouvé.
                </TableCell>
              </TableRow>
            ) : (
              candidats.map((c) => (
                <TableRow key={c.id_candidat} className="hover:bg-[#F3F9F5] transition-colors border-b border-[#F1F8F4] last:border-0">
                  <TableCell>
                    {c.photo ? (
                      <img 
                        src={c.photo} 
                        alt={c.nom_cand} 
                        className="w-10 h-10 rounded-full object-cover border border-[#E6F4ED]" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E7F5EF] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#0A5C36]" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {c.nom_cand.toUpperCase()} {c.pren_cand}
                  </TableCell>
                  <TableCell className="capitalize">{c.genre || "-"}</TableCell>
                  <TableCell className="text-gray-600">{c.email}</TableCell>
                  <TableCell className="text-gray-600">{c.telephone1}</TableCell>
                  
                  {/* ACTIONS */}
                  <TableCell className="flex justify-end gap-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelected(c); setViewing(true); }}
                      className="rounded-xl border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF]"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(c)}
                      className="rounded-xl border-[#E6F4ED] text-gray-700 hover:bg-[#E7F5EF]"
                    >
                      <Edit3 className="w-4 h-4 mr-1" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(c.id_candidat)}
                      className="rounded-xl bg-[#D72638] hover:bg-[#B51F2E] text-white shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE VUE DÉTAILLÉE */}
      {viewing && selected && (
        <CandidatView
          candidat={selected}
          onClose={() => setViewing(false)}
        />
      )}
    </div>
  );
}