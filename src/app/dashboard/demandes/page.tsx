"use client";

import { useEffect, useState } from "react";
import DemandeForm from "@/components/forms/DemandeForm";

interface Demande {
  id: number;
  cv: string;
  diplome_fichier?: string | null;
  anne_obt_dip: number;
  candidat: number;
  campagne: string;
  date_creation?: string;
}

export default function DemandePage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Charger les demandes depuis ton backend Django
  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/demandes/");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setDemandes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📄 Liste des demandes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition"
        >
          {showForm ? "Fermer le formulaire" : "Nouvelle demande"}
        </button>
      </div>

      {showForm && (
        <div className="border rounded-md p-4 bg-gray-50">
          <DemandeForm
            onAdded={() => {
              setShowForm(false);
              fetchDemandes();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement...</p>
        ) : demandes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">CV</th>
                  <th className="p-2 border">Diplôme</th>
                  <th className="p-2 border">Année obtention</th>
                  <th className="p-2 border">Candidat</th>
                  <th className="p-2 border">Campagne</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{d.id}</td>
                    <td className="p-2 border text-blue-600 underline">
                      <a
                        href={`http://127.0.0.1:8000${d.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir CV
                      </a>
                    </td>
                    <td className="p-2 border text-blue-600 underline">
                      {d.diplome_fichier ? (
                        <a
                          href={`http://127.0.0.1:8000${d.diplome_fichier}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir Diplôme
                        </a>
                      ) : (
                        <span className="text-gray-400">Aucun</span>
                      )}
                    </td>
                    <td className="p-2 border text-center">{d.anne_obt_dip}</td>
                    <td className="p-2 border text-center">{d.candidat}</td>
                    <td className="p-2 border text-center">{d.campagne}</td>
                    <td className="p-2 border text-center">
                      {d.date_creation
                        ? new Date(d.date_creation).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucune demande trouvée.</p>
        )}
      </div>
    </div>
  );
}
