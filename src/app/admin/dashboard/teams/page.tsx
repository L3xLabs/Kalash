"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

interface Team {
  teamId: string;
  members: string[];
  teamStrengths: string[];
}

interface TeamsData {
  teams: Team[];
}

export default function Teams() {
  const [teams, setTeams] = useState<TeamsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/team-formation", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError("Failed to load teams. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamAction = async (
    teamId: string,
    action: "approve" | "reject"
  ) => {
    setProcessing(teamId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (teams) {
        setTeams((prev) => {
          if (!prev) return prev;
          return {
            teams: prev.teams.filter((team) => team.teamId !== teamId),
          };
        });
      }
    } catch (err) {
      setError(`Failed to ${action} team. Please try again.`);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Formation</CardTitle>
        <Button onClick={fetchTeams} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
              Generating Teams...
            </>
          ) : (
            "Generate Teams"
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {teams && teams.teams.length > 0 ? (
          teams.teams.map((team) => (
            <div
              key={team.teamId}
              className="flex flex-col space-y-3 p-4 border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{team.teamId}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!processing}
                    onClick={() => handleTeamAction(team.teamId, "approve")}
                  >
                    {processing === team.teamId ? (
                      <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!!processing}
                    onClick={() => handleTeamAction(team.teamId, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <div>
                  <strong>Members:</strong> {team.members.join(", ")}
                </div>
                <div>
                  <strong>Team Strengths:</strong>{" "}
                  {team.teamStrengths.join(", ")}
                </div>
              </div>
            </div>
          ))
        ) : teams ? (
          <div className="text-center text-muted-foreground py-8">
            No teams available. Generate new teams to review.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
