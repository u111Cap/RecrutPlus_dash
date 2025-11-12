"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const Schema = Yup.object().shape({
  NomCand: Yup.string().required("Nom requis"),
  PrenCand: Yup.string().required("Prénom requis"),
  Genre: Yup.string().oneOf(["M", "F"]).required("Genre requis"),
  DatNais: Yup.string().required("Date requise"),
  LieuNais: Yup.string().required("Lieu requis"),
  Telphone1: Yup.string().required("Téléphone requis"),
  Email: Yup.string().email("Email invalide").required("Email requis"),
  IdDiplome: Yup.number().positive().integer().required("Diplôme requis"),
});

interface CandidatFormProps {
  onAdded: () => void;
  onCancel: () => void;
  editId?: number;
}

export default function CandidatForm({ onAdded, onCancel, editId }: CandidatFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [initialValues, setInitialValues] = useState({
    NomCand: "",
    PrenCand: "",
    Genre: "M",
    DatNais: "",
    LieuNais: "",
    Telphone1: "",
    Telphone2: "",
    Email: "",
    Sitmat: "Célibataire",
    IdDiplome: 0,
  });

  // 🟡 Charger les données existantes si editId est fourni
  useEffect(() => {
    if (editId) {
      fetch(`http://127.0.0.1:8000/api/candidats/${editId}/`)
        .then((res) => res.json())
        .then((data) => setInitialValues(data))
        .catch(() => toast.error("Erreur de chargement du candidat"));
    }
  }, [editId]);

  async function onSubmit(values: any, { resetForm }: any) {
    try {
      const formData = new FormData();

      // Ajout des champs texte
      for (const key in values) {
        formData.append(key, values[key]);
      }

      // Ajout du fichier s'il existe
      if (photo) formData.append("Photo", photo);

      const url = editId
        ? `http://127.0.0.1:8000/api/candidats/${editId}/`
        : "http://127.0.0.1:8000/api/candidats/";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l’envoi");

      toast.success(editId ? "Candidat mis à jour !" : "Candidat ajouté !");
      resetForm();
      setPhoto(null);
      onAdded();
    } catch (err) {
      console.error(err);
      toast.error("Échec de l’envoi");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold mb-3 text-gray-800">
        {editId ? "Modifier le candidat" : "Ajouter un candidat"}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3 text-sm">
            {/* Nom et prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Nom</label>
                <Field name="NomCand" className="w-full border rounded-md px-2 py-1.5" />
                <ErrorMessage name="NomCand" component="p" className="text-red-600 text-xs" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Prénom</label>
                <Field name="PrenCand" className="w-full border rounded-md px-2 py-1.5" />
                <ErrorMessage name="PrenCand" component="p" className="text-red-600 text-xs" />
              </div>
            </div>

            {/* Genre et date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Genre</label>
                <Field as="select" name="Genre" className="w-full border rounded-md px-2 py-1.5">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </Field>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date de naissance</label>
                <Field type="date" name="DatNais" className="w-full border rounded-md px-2 py-1.5" />
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-gray-700 mb-1">Lieu de naissance</label>
              <Field name="LieuNais" className="w-full border rounded-md px-2 py-1.5" />
            </div>

            {/* Téléphones */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Téléphone 1</label>
                <Field name="Telphone1" className="w-full border rounded-md px-2 py-1.5" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Téléphone 2</label>
                <Field name="Telphone2" className="w-full border rounded-md px-2 py-1.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <Field type="email" name="Email" className="w-full border rounded-md px-2 py-1.5" />
            </div>

            {/* Photo fichier */}
            <div>
              <label className="block text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
            </div>

            {/* Situation matrimoniale */}
            <div>
              <label className="block text-gray-700 mb-1">Situation matrimoniale</label>
              <Field as="select" name="Sitmat" className="w-full border rounded-md px-2 py-1.5">
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
                <option value="Divorcé">Divorcé</option>
              </Field>
            </div>

            {/* Diplôme */}
            <div>
              <label className="block text-gray-700 mb-1">Diplôme (ID)</label>
              <Field type="number" name="IdDiplome" className="w-full border rounded-md px-2 py-1.5" />
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {isSubmitting ? "Envoi..." : editId ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
