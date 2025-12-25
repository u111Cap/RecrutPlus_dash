"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const API_DOMAINE = "http://127.0.0.1:8000/api/domaines/";
const API_DIPLOME = "http://127.0.0.1:8000/api/diplomes/";

export default function DiplomeForm({ diplome, onClose }: any) {
  const [form, setForm] = useState({
    designation: diplome?.designation || "",
    domaineId: diplome?.domaine || "",
  });
  const [domaines, setDomaines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les domaines depuis API V1
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const res = await axios.get(API_DOMAINE);
        setDomaines(res.data);
      } catch (err) {
        console.error("Erreur chargement domaines:", err);
        alert("Impossible de charger les domaines");
      }
    };
    fetchDomaines();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.domaineId) {
      alert("Veuillez sélectionner un domaine");
      return;
    }

    setLoading(true);
    const payload = {
      designation: form.designation,
      domaine: Number(form.domaineId), // API V1 attend id numérique
    };

    try {
      if (diplome) {
        await axios.put(`${API_DIPLOME}${diplome.id_diplome}/`, payload);
      } else {
        await axios.post(API_DIPLOME, payload);
      }
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde diplôme:", err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-5 rounded-xl p-6 border border-[#E6F4ED] bg-white shadow-md">
        <DialogHeader>
          <DialogTitle className="text-[#0A5C36] text-xl font-bold">
            {diplome ? "Modifier le Diplôme" : "Nouveau Diplôme"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Désignation */}
          <div className="flex flex-col gap-1">
            <Label className="text-[#0A5C36] font-medium">Désignation</Label>
            <Input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-lg"
              placeholder="Ex: Ingénierie Logicielle"
              required
            />
          </div>

          {/* Domaine */}
          <div className="flex flex-col gap-1">
            <Label className="text-[#0A5C36] font-medium">Domaine</Label>
            <Select
              value={String(form.domaineId)}
              onValueChange={(v) => setForm({ ...form, domaineId: v })}
            >
              <SelectTrigger className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-lg">
                <SelectValue placeholder="Choisir un domaine" />
              </SelectTrigger>
              <SelectContent>
                {domaines.map((d) => (
                  <SelectItem key={d.id_domaine} value={String(d.id_domaine)}>
                    {d.libdom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boutons */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A5C36] hover:bg-[#0C7041] text-white rounded-xl shadow-sm mt-2"
          >
            {loading ? "Enregistrement..." : diplome ? "Mettre à jour" : "Créer"}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="w-full border border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF] rounded-xl mt-2"
          >
            Annuler
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
