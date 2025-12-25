"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Loader2, FileUp } from "lucide-react";
import { toast } from "sonner";

export default function DemandeForm({ demande, onClose, onAdded }: any) {
  const [form, setForm] = useState({
    anne_obt_dip: "",
    etat_dde: "En attente",
    reponse: "",
    cod_anne: "", // ID de la campagne
    id_candidat: "", // ID du candidat
  });

  const [files, setFiles] = useState<{ cv: File | null; diplome: File | null }>({
    cv: null,
    diplome: null,
  });

  const [campagnes, setCampagnes] = useState<any[]>([]);
  const [candidats, setCandidats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les données initiales (Relations + Données si édition)
  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const [campRes, candRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/campagnes/"),
          fetch("http://127.0.0.1:8000/api/candidats/"),
        ]);
        setCampagnes(await campRes.json());
        setCandidats(await candRes.json());
      } catch (err) {
        toast.error("Erreur lors du chargement des données de référence");
      }
    };
    fetchRelations();

    if (demande) {
      setForm({
        anne_obt_dip: demande.anne_obt_dip || "",
        etat_dde: demande.etat_dde || "En attente",
        reponse: demande.reponse || "",
        cod_anne: demande.campagne?.cod_anne || "",
        id_candidat: demande.candidat?.id_candidat || "",
      });
    }
  }, [demande]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      // Ajout des champs texte
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      
      // Ajout des fichiers
      if (files.cv) formData.append("cv", files.cv);
      if (files.diplome) formData.append("diplome_fichier", files.diplome);

      const method = demande ? "PUT" : "POST";
      const url = demande 
        ? `http://127.0.0.1:8000/api/demandes/${demande.id_dde}/` 
        : "http://127.0.0.1:8000/api/demandes/";

      const res = await fetch(url, { method, body: formData });
      
      if (!res.ok) throw new Error();

      toast.success(demande ? "Demande mise à jour" : "Demande créée avec succès");
      onAdded(); // Rafraîchir la liste
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la soumission du dossier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-[#E6F4ED] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A5C36]">
            {demande ? "Modifier le Dossier" : "Nouveau Dossier de Candidature"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          
          {/* Sélection Candidat */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[#0A5C36] font-semibold text-sm">Candidat concerné</Label>
            <Select 
              value={String(form.id_candidat)} 
              onValueChange={(v) => setForm({ ...form, id_candidat: v })}
            >
              <SelectTrigger className="border-[#0A5C36] focus:ring-[#B4EFC4]">
                <SelectValue placeholder="Sélectionner le candidat" />
              </SelectTrigger>
              <SelectContent>
                {candidats.map((cand) => (
                  <SelectItem key={cand.id_candidat} value={String(cand.id_candidat)}>
                    {cand.nom_cand} {cand.pren_cand} (ID: {cand.id_candidat})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection Campagne */}
          <div className="space-y-1.5">
            <Label className="text-[#0A5C36] font-semibold text-sm">Campagne / Année</Label>
            <Select 
              value={form.cod_anne} 
              onValueChange={(v) => setForm({ ...form, cod_anne: v })}
            >
              <SelectTrigger className="border-[#0A5C36]">
                <SelectValue placeholder="Choisir la campagne" />
              </SelectTrigger>
              <SelectContent>
                {campagnes.map((c) => (
                  <SelectItem key={c.cod_anne} value={String(c.cod_anne)}>
                    {c.cod_anne} - {c.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Année Obtention */}
          <div className="space-y-1.5">
            <Label className="text-[#0A5C36] font-semibold text-sm">Année du diplôme</Label>
            <Input
              type="number"
              placeholder="Ex: 2023"
              value={form.anne_obt_dip}
              onChange={(e) => setForm({ ...form, anne_obt_dip: e.target.value })}
              className="border-[#0A5C36] focus:ring-[#B4EFC4]"
              required
            />
          </div>

          {/* État de la demande */}
          <div className="space-y-1.5">
            <Label className="text-[#0A5C36] font-semibold text-sm">Statut du dossier</Label>
            <Select 
              value={form.etat_dde} 
              onValueChange={(v) => setForm({ ...form, etat_dde: v })}
            >
              <SelectTrigger className="border-[#0A5C36]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Acceptée">Acceptée</SelectItem>
                <SelectItem value="Rejetée">Rejetée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[#0A5C36] font-semibold text-sm">Complément d'info</Label>
            <Input
              value={form.reponse}
              onChange={(e) => setForm({ ...form, reponse: e.target.value })}
              className="border-[#0A5C36]"
              placeholder="Note interne ou réponse"
            />
          </div>

          {/* Upload Fichiers */}
          <div className="space-y-1.5 p-3 border border-dashed border-[#B4EFC4] rounded-xl bg-[#F9FDFB]">
            <Label className="text-[#0A5C36] font-semibold flex items-center gap-2">
              <FileUp className="w-4 h-4" /> Curriculum Vitae (PDF)
            </Label>
            <Input
              type="file"
              name="cv"
              accept=".pdf"
              onChange={handleFileChange}
              className="bg-white border-[#B4EFC4] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-3 border border-dashed border-[#B4EFC4] rounded-xl bg-[#F9FDFB]">
            <Label className="text-[#0A5C36] font-semibold flex items-center gap-2">
              <FileUp className="w-4 h-4" /> Copie Diplôme (PDF)
            </Label>
            <Input
              type="file"
              name="diplome"
              accept=".pdf"
              onChange={handleFileChange}
              className="bg-white border-[#B4EFC4] cursor-pointer"
            />
          </div>

          {/* Boutons d'action */}
          <div className="md:col-span-2 flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl py-6 shadow-lg transition-all"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traitement en cours...</>
              ) : (
                demande ? "Enregistrer les modifications" : "Soumettre la candidature"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full text-[#0A5C36] hover:bg-[#E7F5EF] py-4"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}