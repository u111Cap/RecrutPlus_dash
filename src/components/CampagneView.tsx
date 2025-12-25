"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Campagne } from "@/lib/types";

export default function CampagneView({
  campagne,
  onClose,
}: {
  campagne: Campagne;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4 rounded-2xl shadow-xl border border-[#E6F4ED] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A5C36]">
            Détails de la Campagne
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong className="text-[#0A5C36]">Nom :</strong> {campagne.description}
          </p>
          <p>
            <strong className="text-[#0A5C36]">Date Début :</strong>{" "}
            {new Date(campagne.datDebut).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-[#0A5C36]">Date Fin :</strong>{" "}
            {new Date(campagne.datFin).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-[#0A5C36]">État :</strong> {campagne.etat}
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-[#0A5C36] text-white hover:bg-[#1B7A53] transition-colors shadow-md"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
