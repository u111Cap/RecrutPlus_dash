"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Schéma de validation aligné sur l'API Django
const Schema = Yup.object().shape({
  nom_cand: Yup.string().required("Nom requis"),
  pren_cand: Yup.string().required("Prénom requis"),
  genre: Yup.string().oneOf(["M", "F"]).required("Genre requis"),
  dat_nais: Yup.string().required("Date de naissance requise"),
  lieu_nais: Yup.string().required("Lieu requis"),
  telephone1: Yup.string().required("Téléphone requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  id_diplome: Yup.number().positive().integer().required("Diplôme requis"),
});

interface CandidatFormProps {
  onAdded: () => void;
  onCancel: () => void;
  editId?: string | number | null;
  className?: string;
}

export default function CandidatForm({ onAdded, onCancel, editId }: CandidatFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [diplomes, setDiplomes] = useState<any[]>([]);
  const [initialValues, setInitialValues] = useState({
    nom_cand: "",
    pren_cand: "",
    genre: "M",
    dat_nais: "",
    lieu_nais: "",
    telephone1: "",
    telephone2: "",
    email: "",
    sitmat: "Célibataire",
    id_diplome: "",
  });

  // Charger les diplômes et les données si mode édition
  useEffect(() => {
    // 1. Fetch diplômes
    fetch("http://127.0.0.1:8000/api/diplomes/")
      .then((res) => res.json())
      .then((data) => setDiplomes(data))
      .catch(() => toast.error("Erreur chargement diplômes"));

    // 2. Fetch candidat si modification
    if (editId) {
      fetch(`http://127.0.0.1:8000/api/candidats/${editId}/`)
        .then((res) => res.json())
        .then((data) => {
          // On mappe les données de l'API vers le formulaire
          setInitialValues({
            nom_cand: data.nom_cand || "",
            pren_cand: data.pren_cand || "",
            genre: data.genre || "M",
            dat_nais: data.dat_nais ? data.dat_nais.split('T')[0] : "",
            lieu_nais: data.lieu_nais || "",
            telephone1: data.telephone1 || "",
            telephone2: data.telephone2 || "",
            email: data.email || "",
            sitmat: data.sitmat || "Célibataire",
            id_diplome: data.id_diplome || "",
          });
        })
        .catch(() => toast.error("Erreur de chargement du candidat"));
    }
  }, [editId]);

  async function onSubmit(values: any) {
    try {
      const formData = new FormData();
      
      // Conversion des données pour FormData
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      if (photo) formData.append("photo", photo);

      const url = editId
        ? `http://127.0.0.1:8000/api/candidats/${editId}/`
        : "http://127.0.0.1:8000/api/candidats/";
      
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData, // Pas de Content-Type header, le navigateur le met auto pour FormData
      });

      if (!res.ok) throw new Error("Erreur serveur");

      toast.success(editId ? "Candidat mis à jour !" : "Candidat créé !");
      onAdded();
    } catch (err) {
      toast.error("Échec de l'enregistrement");
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl border border-[#E6F4ED]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A5C36]">
            {editId ? "Modifier le Candidat" : "Nouveau Candidat"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              
              {/* Nom */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Nom</Label>
                <Field name="nom_cand" as={Input} className="border-[#0A5C36] focus-visible:ring-[#0A5C36]" />
                <ErrorMessage name="nom_cand" component="p" className="text-red-500 text-xs" />
              </div>

              {/* Prénom */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Prénom</Label>
                <Field name="pren_cand" as={Input} className="border-[#0A5C36] focus-visible:ring-[#0A5C36]" />
                <ErrorMessage name="pren_cand" component="p" className="text-red-500 text-xs" />
              </div>

              {/* Genre (Select UI) */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Genre</Label>
                <Select value={values.genre} onValueChange={(v) => setFieldValue("genre", v)}>
                  <SelectTrigger className="border-[#0A5C36]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date de Naissance */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Date de Naissance</Label>
                <Field name="dat_nais" type="date" as={Input} className="border-[#0A5C36]" />
              </div>

              {/* Téléphone 1 */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Téléphone Principal</Label>
                <Field name="telephone1" as={Input} className="border-[#0A5C36]" />
                <ErrorMessage name="telephone1" component="p" className="text-red-500 text-xs" />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Email</Label>
                <Field name="email" type="email" as={Input} className="border-[#0A5C36]" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
              </div>

              {/* Photo */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Photo</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="border-[#0A5C36]"
                  onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
                />
              </div>

              {/* Diplôme (Dynamique) */}
              <div className="space-y-1">
                <Label className="text-[#0A5C36]">Diplôme</Label>
                <Select 
                  value={String(values.id_diplome)} 
                  onValueChange={(v) => setFieldValue("id_diplome", v)}
                >
                  <SelectTrigger className="border-[#0A5C36]">
                    <SelectValue placeholder="Sélectionner un diplôme" />
                  </SelectTrigger>
                  <SelectContent>
                    {diplomes.map((d: any) => (
                      <SelectItem key={d.id_diplome} value={String(d.id_diplome)}>
                        {d.designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage name="id_diplome" component="p" className="text-red-500 text-xs" />
              </div>

              {/* Boutons d'action */}
              <div className="md:col-span-2 flex gap-3 mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl py-6"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (editId ? "Enregistrer les modifications" : "Créer le candidat")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF] rounded-xl py-6"
                >
                  Annuler
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}