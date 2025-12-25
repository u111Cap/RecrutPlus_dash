"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import DomaineForm from "../forms/DomaineForm";

const API_URL = "http://127.0.0.1:8000/api/domaines/";

export default function DomaineList({ onAdd }: { onAdd: () => void }) {
  const [domaines, setDomaines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchDomaines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setDomaines(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de charger les domaines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomaines();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce domaine ?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchDomaines();
      alert("✅ Domaine supprimé !");
    } catch (err) {
      console.error(err);
      alert("❌ Échec de la suppression");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + Ajouter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0A5C36]">Liste des Domaines</h2>
        <Button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-[#0A5C36] text-white hover:bg-[#0C7041] rounded-xl shadow-sm"
        >
          + Ajouter Domaine
        </Button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin w-6 h-6 mr-2 text-[#0A5C36]" />
          <span className="text-gray-500">Chargement...</span>
        </div>
      ) : (
        <Table className="w-full border border-[#E7F5EF] rounded-xl shadow-sm overflow-hidden">
          <TableHeader>
            <TableRow className="bg-[#E7F5EF]">
              <TableHead className="w-16 text-[#0A5C36] font-semibold">ID</TableHead>
              <TableHead className="text-[#0A5C36] font-semibold">Libellé</TableHead>
              <TableHead className="text-right text-[#0A5C36] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {domaines.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  Aucun domaine trouvé.
                </TableCell>
              </TableRow>
            )}
            {domaines.map((d) => (
              <TableRow key={d.id_dom} className="hover:bg-[#E9F7F0] transition-colors">
                <TableCell className="text-[#0A5C36]">{d.id_dom}</TableCell>
                <TableCell className="text-[#0A5C36]">{d.lib_dom}</TableCell>
                <TableCell className="flex justify-end gap-2">
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
                    onClick={() => handleDelete(d.id_dom)}
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Formulaire */}
      {openForm && (
        <DomaineForm
          domaine={selected}
          onClose={() => { setOpenForm(false); fetchDomaines(); }}
        />
      )}
    </div>
  );
}
