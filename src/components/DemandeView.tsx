"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DemandeView({ demande, onClose }: any) {
  if (!demande) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg border border-[#E6F4ED] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A5C36]">
            Détails de la demande #{demande.idDde}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4 text-gray-700">
          <p><strong className="text-[#0A5C36]">Candidat :</strong> {demande.candidat?.nomCand} {demande.candidat?.prenCand}</p>
          <p><strong className="text-[#0A5C36]">Campagne :</strong> {demande.campagne?.description}</p>
          <p><strong className="text-[#0A5C36]">État :</strong> {demande.etatDde}</p>
          <p><strong className="text-[#0A5C36]">Date :</strong> {new Date(demande.datDde).toLocaleDateString()}</p>
          <p><strong className="text-[#0A5C36]">Année d’obtention :</strong> {demande.anneObtDip}</p>
          <p><strong className="text-[#0A5C36]">Réponse :</strong> {demande.reponse || "-"}</p>
          {demande.cv && (
            <p>
              <strong className="text-[#0A5C36]">CV :</strong>{" "}
              <a href={demande.cv} target="_blank" className="text-[#0A5C36] underline hover:text-[#1B7A53] transition-colors">
                Voir CV
              </a>
            </p>
          )}
          {demande.diplomePath && (
            <p>
              <strong className="text-[#0A5C36]">Diplôme :</strong>{" "}
              <a href={demande.diplomePath} target="_blank" className="text-[#0A5C36] underline hover:text-[#1B7A53] transition-colors">
                Voir Diplôme
              </a>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl shadow-md transition-transform hover:scale-[1.02]"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
