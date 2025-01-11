import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Teams() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve Teams</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {["Team A", "Team B", "Team C"].map((team) => (
          <div
            key={team}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <span>{team}</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Approve
              </Button>
              <Button variant="destructive" size="sm">
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
