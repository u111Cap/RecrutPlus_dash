"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Edit3, Trash2, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Demande {
  id: number;
  cv: string;
  diplome_fichier?: string | null;
  anne_obt_dip: number;
  candidat: number;
  campagne: string;
  date_creation?: string;
}

interface DemandeListProps {
  onAdd: () => void;
  onEdit: (demande: Demande) => void;
}

export default function DemandeList({ onAdd, onEdit }: DemandeListProps) {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000/api/demandes/";

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setDemandes(res.data);
    } catch (error) {
      toast.error("Erreur de chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette demande ?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("Demande supprimée");
      fetchDemandes();
    } catch (error) {
      toast.error("Échec de la suppression");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="animate-spin w-8 h-8 text-[#0A5C36]" />
      <span className="ml-3 text-gray-500 font-medium">Chargement des dossiers...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#0A5C36]">Liste des Demandes</h2>
        <Button onClick={onAdd} className="bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl shadow-md">
          ➕ Nouvelle Demande
        </Button>
      </div>

      <div className="rounded-2xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E7F5EF] hover:bg-[#E7F5EF]">
              <TableHead className="font-bold text-[#0A5C36] w-16 text-center">ID</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Documents</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Année Diplôme</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">ID Candidat</TableHead>
              <TableHead className="font-bold text-[#0A5C36]">Campagne</TableHead>
              <TableHead className="text-right font-bold text-[#0A5C36]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demandes.map((d) => (
              <TableRow key={d.id} className="hover:bg-[#F3F9F5] transition-colors border-b border-[#F1F8F4]">
                <TableCell className="text-center font-medium text-gray-500">{d.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <a href={d.cv.startsWith('http') ? d.cv : `http://127.0.0.1:8000${d.cv}`} 
                       target="_blank" className="flex items-center text-blue-600 hover:underline text-xs">
                      <FileText className="w-3 h-3 mr-1" /> CV
                    </a>
                    {d.diplome_fichier && (
                      <a href={d.diplome_fichier.startsWith('http') ? d.diplome_fichier : `http://127.0.0.1:8000${d.diplome_fichier}`} 
                         target="_blank" className="flex items-center text-emerald-600 hover:underline text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" /> Diplôme
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{d.anne_obt_dip}</TableCell>
                <TableCell className="font-semibold text-gray-700">#{d.candidat}</TableCell>
                <TableCell>{d.campagne}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(d)} className="rounded-xl border-[#E6F4ED] text-gray-600 hover:bg-[#E7F5EF]">
                    <Edit3 className="w-4 h-4 mr-1" /> Modifier
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(d.id)} className="rounded-xl bg-[#D72638] hover:bg-[#B51F2E] text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}