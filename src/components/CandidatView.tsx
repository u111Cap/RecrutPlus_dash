"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CandidatView({ candidat, onClose }: any) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4 rounded-2xl shadow-lg border border-[#E6F4ED] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A5C36]">
            Détails du Candidat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-gray-700">
          <p><strong className="text-[#0A5C36]">Nom :</strong> {candidat.nomCand}</p>
          <p><strong className="text-[#0A5C36]">Prénom :</strong> {candidat.prenCand}</p>
          <p><strong className="text-[#0A5C36]">Genre :</strong> {candidat.genre}</p>
          <p><strong className="text-[#0A5C36]">Date de naissance :</strong> {new Date(candidat.datNais).toLocaleDateString()}</p>
          <p><strong className="text-[#0A5C36]">Lieu de naissance :</strong> {candidat.lieuNais}</p>
          <p><strong className="text-[#0A5C36]">Email :</strong> {candidat.email}</p>
          <p><strong className="text-[#0A5C36]">Téléphone 1 :</strong> {candidat.telephone1}</p>
          {candidat.telephone2 && <p><strong className="text-[#0A5C36]">Téléphone 2 :</strong> {candidat.telephone2}</p>}
          <p><strong className="text-[#0A5C36]">Statut matrimonial :</strong> {candidat.sitMat}</p>
          <p><strong className="text-[#0A5C36]">Diplôme :</strong> {candidat.diplome?.designation}</p>
          {candidat.photo && <p><strong className="text-[#0A5C36]">Photo :</strong> {candidat.photo}</p>}
        </div>

        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
