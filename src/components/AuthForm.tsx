
"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Le nom d'utilisateur est requis"),
  password: Yup.string().required("Mot de passe requis"),
});

export default function AuthForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleLogin(values: { username: string; password: string }) {
    setServerError(null);

    try {
      const res = await fetch(" http://127.0.0.1:8000/login/admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json();
        setServerError(body.error || "Identifiants invalides");
        return;
      }

      const data = await res.json();
      // ✅ Sauvegarde des tokens JWT dans le localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      // ✅ Redirection vers le dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setServerError("Impossible de joindre le serveur");
    }
  }

  return (
    <Formik initialValues={{ username: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Nom d'utilisateur
            </label>
            <Field name="username" className="w-full rounded border px-3 py-2" />
            <ErrorMessage name="username" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Mot de passe
            </label>
            <Field name="password" type="password" className="w-full rounded border px-3 py-2" />
            <ErrorMessage name="password" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded px-4 py-2 bg-green-600 text-white font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
