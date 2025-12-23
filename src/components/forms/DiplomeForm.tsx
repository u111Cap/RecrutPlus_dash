"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Type TypeScript pour les domaines
export interface Domaine {
  id_domaine: number;
  libdom: string;
}

// Validation Yup
const Schema = Yup.object({
  Designation: Yup.string().required("Requis"),
  IdDom: Yup.number()
    .required("Requis")
    .typeError("Sélectionnez un domaine"),
});

interface Props {
  onAdded: () => void;
  onCancel: () => void;
}

export default function DiplomeForm({ onAdded, onCancel }: Props) {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des domaines depuis l'API Django
    fetch("http://127.0.0.1:8000/api/domaines/")
      .then((res) => res.json())
      .then((data) => setDomaines(data))
      .catch((err) => console.error("Erreur lors du chargement des domaines", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">
        Ajouter un diplôme
      </h2>

      <Formik
        initialValues={{ Designation: "", IdDom: "" }}
        validationSchema={Schema}
        onSubmit={async (values, { resetForm }) => {
          // Vérification qu'un domaine a bien été sélectionné
          if (values.IdDom === "") {
            alert("Veuillez sélectionner un domaine");
            return;
          }

          const payload = {
            designation: values.Designation,
            domaine: Number(values.IdDom), // conversion en number obligatoire
          };

          try {
            const res = await fetch("http://127.0.0.1:8000/api/diplomes/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              resetForm();
              onAdded();
            } else {
              const errorData = await res.json();
              console.error("Erreur API:", errorData);
              alert("Erreur lors de l'ajout du diplôme");
            }
          } catch (err) {
            console.error(err);
            alert("Erreur réseau");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Désignation */}
            <div>
              <label className="font-medium text-sm">Désignation</label>
              <Field
                name="Designation"
                placeholder="Ex: Informatique"
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2
                  focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              />
              <ErrorMessage
                name="Designation"
                className="text-red-500 text-sm mt-1"
                component="div"
              />
            </div>

            {/* Domaine */}
            <div>
              <label className="font-medium text-sm">Domaine</label>
              <Field
                as="select"
                name="IdDom"
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 bg-white
                  focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              >
                <option value="">Sélectionnez un domaine</option>
                {loading ? (
                  <option disabled>Chargement...</option>
                ) : (
                  domaines.map((dom) => (
                    <option key={dom.id_domaine} value={dom.id_domaine}>
                      {dom.libdom}
                    </option>
                  ))
                )}
              </Field>
              <ErrorMessage
                name="IdDom"
                className="text-red-500 text-sm mt-1"
                component="div"
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" type="button" onClick={onCancel}>
                Retour
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Ajouter"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
