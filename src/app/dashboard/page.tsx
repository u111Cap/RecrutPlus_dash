"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Calendar, Users as UsersIcon, Briefcase, Award, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardSymphos() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    campagnes: 0,
    domaines: 0,
    diplomes: 0,
    candidats: 0,
    demandes: 0,
  });

  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("http://127.0.0.1:8000/api/stats/");
        setStats(statsRes.data.global);

        const candRes = await axios.get("http://127.0.0.1:8000/candidats/");
        setCandidates(candRes.data);
      } catch (err) {
        console.error("Erreur dashboard :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCandidates = candidates
    .filter((c) =>
      c.nom_complet?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(-5)
    .reverse();

  const statCards = [
    { title: "Domaines", value: stats.domaines, icon: Briefcase },
    { title: "Diplômes", value: stats.diplomes, icon: Award },
    { title: "Candidats", value: stats.candidats, icon: Users },
    { title: "Demandes", value: stats.demandes, icon: FileText },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A5C36]">
          Tableau de bord
        </h1>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <Input
            placeholder="Rechercher un candidat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-[220px] border-[#1B7A53]
              focus:ring-2 focus:ring-[#B4EFC4]
              focus:border-[#0A5C36] transition"
          />

          <Avatar className="border-2 border-[#0A5C36] w-9 h-9">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ title, value, icon: Icon }) => (
            <Card
              key={title}
              className="p-4 bg-white border border-[#E6F4ED]
                rounded-lg shadow-md hover:shadow-xl transition"
            >
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{title}</p>
                  <p className="text-2xl font-bold text-[#0A5C36]">
                    {loading ? "…" : value}
                  </p>
                </div>
                <Icon className="w-6 h-6 text-[#0A5C36]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Candidats */}
        <Card className="shadow-lg border border-[#E6F4ED] rounded-lg">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-lg font-bold text-[#0A5C36]">
              Candidats récents
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 overflow-x-auto">
            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : (
              <Table className="border border-gray-200 rounded-lg text-sm">
                <TableHeader>
                  <TableRow className="bg-[#E9F7F0]">
                    <TableHead>ID</TableHead>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCandidates.map((c) => (
                    <TableRow
                      key={c.id}
                      className="hover:bg-[#F4FBF7] transition"
                    >
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.nom_complet}</TableCell>
                      <TableCell>{c.email}</TableCell>
                    </TableRow>
                  ))}

                  {filteredCandidates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        Aucun candidat trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#0A5C36]
              text-[#0A5C36] hover:bg-[#E9F7F0]"
          >
            <Calendar className="w-4 h-4" /> Calendrier
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#0A5C36]
              text-[#0A5C36] hover:bg-[#E9F7F0]"
          >
            <UsersIcon className="w-4 h-4" /> Utilisateurs
          </Button>
        </div>
      </main>
    </div>
  );
}
