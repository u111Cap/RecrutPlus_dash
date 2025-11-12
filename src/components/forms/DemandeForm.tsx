"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface Demande {
  id_dde: number;
  candidat: {
    id_candidat: number;
    nom_cand: string;
    pren_cand: string;
  };
  campagne: {
    cod_anne: string;
    description: string;
  };
  anne_obt_dip: number;
  etat_dde: string;
  cv: string;
  diplome_fichier?: string;
  reponse?: string;
}

interface DemandeListProps {
  onAdd?: () => void;
  refresh?: boolean;
}

export default function DemandeList({ onAdd, refresh }: DemandeListProps) {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemandes() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/demandes/");
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setDemandes(data);
      } catch (err: any) {
        console.error("Erreur chargement demandes :", err);
        setError("Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    }
    loadDemandes();
  }, [refresh]);

  if (loading) return <p className="text-sm text-gray-500 mt-4">Chargement des demandes...</p>;

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-6">
        {error}
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Liste des demandes</h2>
        <Button
          onClick={onAdd}
          variant="outline"
          className="text-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead>Campagne</TableHead>
              <TableHead>Année obtention</TableHead>
              <TableHead>État</TableHead>
              <TableHead>CV</TableHead>
              <TableHead>Diplôme</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {demandes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 italic py-4">
                  Aucune demande trouvée
                </TableCell>
              </TableRow>
            ) : (
              demandes.map((d) => (
                <TableRow key={d.id_dde} className="border-t hover:bg-gray-50 transition">
                  <TableCell>{d.candidat.nom_cand} {d.candidat.pren_cand}</TableCell>
                  <TableCell>{d.campagne.cod_anne} - {d.campagne.description}</TableCell>
                  <TableCell>{d.anne_obt_dip}</TableCell>
                  <TableCell>{d.etat_dde}</TableCell>
                  <TableCell>
                    <a
                      href={d.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Voir CV
                    </a>
                  </TableCell>
                  <TableCell>
                    {d.diplome_fichier ? (
                      <a
                        href={d.diplome_fichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Voir Diplôme
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="sm">
                      ✏️
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Supprimer cette demande ?")) {
                          fetch(`/api/demandes/${d.id_dde}/`, { method: "DELETE" })
                            .then(() =>
                              setDemandes((prev) =>
                                prev.filter((item) => item.id_dde !== d.id_dde)
                              )
                            );
                        }
                      }}
                    >
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
