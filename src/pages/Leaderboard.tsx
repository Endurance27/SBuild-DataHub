import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const { id } = useParams();

  const leaderboardData = [
    { rank: 1, team: "DataMasters", score: 0.2341, submissions: 47, lastSubmission: "2 hours ago", change: 0 },
    { rank: 2, team: "AI Innovators", score: 0.2389, submissions: 52, lastSubmission: "5 hours ago", change: 1 },
    { rank: 3, team: "Ghana ML Squad", score: 0.2412, submissions: 38, lastSubmission: "1 day ago", change: -1 },
    { rank: 4, team: "CodeCrafters", score: 0.2456, submissions: 43, lastSubmission: "3 hours ago", change: 2 },
    { rank: 5, team: "Predictive Minds", score: 0.2501, submissions: 35, lastSubmission: "12 hours ago", change: -1 },
    { rank: 6, team: "Neural Ninjas", score: 0.2534, submissions: 41, lastSubmission: "8 hours ago", change: 0 },
    { rank: 7, team: "Data Wizards", score: 0.2567, submissions: 29, lastSubmission: "1 day ago", change: 3 },
    { rank: 8, team: "Quantum Analytics", score: 0.2598, submissions: 44, lastSubmission: "4 hours ago", change: -2 },
    { rank: 9, team: "Smart Farmers", score: 0.2623, submissions: 31, lastSubmission: "6 hours ago", change: 1 },
    { rank: 10, team: "Accra Data Lab", score: 0.2651, submissions: 36, lastSubmission: "10 hours ago", change: -1 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <span className="text-muted-foreground">—</span>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Link to={`/competitions/${id}`}>
                <Button variant="ghost" className="mb-4">← Back to Competition</Button>
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-10 w-10 text-primary" />
                <div>
                  <h1 className="text-4xl font-bold">Competition Leaderboard</h1>
                  <p className="text-muted-foreground">Ghana Crop Yield Prediction Challenge</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Top 3 Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaderboardData.slice(0, 3).map((entry) => (
                  <Card key={entry.rank} className={entry.rank === 1 ? "border-primary" : ""}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        {getRankIcon(entry.rank)}
                      </div>
                      <CardTitle className="text-xl">{entry.team}</CardTitle>
                      <CardDescription>Rank #{entry.rank}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {entry.score.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.submissions} submissions
                      </div>
                      <Badge variant="secondary">{entry.lastSubmission}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Full Leaderboard Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Full Leaderboard</CardTitle>
                  <CardDescription>Ranked by RMSE score (lower is better)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Score (RMSE)</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Last Submission</TableHead>
                        <TableHead className="w-20">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((entry) => (
                        <TableRow key={entry.rank} className={entry.rank <= 3 ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getRankIcon(entry.rank)}
                              <span>#{entry.rank}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{entry.team}</TableCell>
                          <TableCell className="font-mono">{entry.score.toFixed(4)}</TableCell>
                          <TableCell>{entry.submissions}</TableCell>
                          <TableCell className="text-muted-foreground">{entry.lastSubmission}</TableCell>
                          <TableCell>{getChangeIndicator(entry.change)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Leaderboard is updated in real-time. Final rankings will be determined after the competition deadline.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
