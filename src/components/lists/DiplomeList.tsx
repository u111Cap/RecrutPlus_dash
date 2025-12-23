"use client";

import { useEffect, useState } from "react";
import { Diplome } from "@/lib/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit3, Plus } from "lucide-react";

export default function DiplomeList({ onAdd }: { onAdd: () => void }) {
  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiplomes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diplomes");
      setDiplomes(await res.json());
    } catch {
      alert("❌ Impossible de charger les diplômes.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiplomes();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Diplômes</h2>
        <Button onClick={onAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <Table className="border border-slate-200 rounded-lg">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead>ID</TableHead>
            <TableHead>Désignation</TableHead>
            <TableHead>Domaine</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {diplomes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                Aucun diplôme trouvé.
              </TableCell>
            </TableRow>
          )}

          {diplomes.map((dip) => (
            <TableRow key={dip.IdDiplome} className="hover:bg-slate-50 duration-200">
              <TableCell>{dip.IdDiplome}</TableCell>
              <TableCell>{dip.Designation}</TableCell>
              <TableCell>{dip.LibDom}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
