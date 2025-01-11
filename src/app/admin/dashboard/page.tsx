"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Stats {
  totalRoles: number;
  totalModules: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data: Stats = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg text-blue-800">
            <h3 className="text-lg font-semibold">Total Roles</h3>
            <p className="text-2xl font-bold">{stats.totalRoles}</p>
          </div>
          <div className="p-4 bg-green-100 text-green-950 rounded-lg">
            <h3 className="text-lg font-semibold">Total Modules</h3>
            <p className="text-2xl font-bold">{stats.totalModules}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
