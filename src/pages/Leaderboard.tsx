import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Entry { rank: number; team: string; score: number; submissions: number; lastSubmission: string; }

const Leaderboard = () => {
  const { id } = useParams();
  const [competitionTitle, setCompetitionTitle] = useState("Competition Leaderboard");
  const [rows, setRows] = useState<Entry[]>([]);

  useEffect(() => {
    (async () => {
      if (id) {
        const { data: c } = await supabase.from("competitions").select("title").eq("id", id).maybeSingle();
        if (c?.title) setCompetitionTitle(c.title);
      }
      const query = supabase
        .from("competition_submissions")
        .select("user_id,score,created_at,profiles:user_id(display_name)")
        .order("score", { ascending: true });
      const { data } = id ? await query.eq("competition_id", id) : await query.limit(100);

      // Best score per user
      const best: Record<string, { score: number; count: number; last: string; name: string }> = {};
      (data ?? []).forEach((r: any) => {
        const uid = r.user_id;
        const name = r.profiles?.display_name ?? uid?.slice(0, 8) ?? "Anonymous";
        if (r.score === null) return;
        if (!best[uid] || r.score < best[uid].score) {
          best[uid] = { score: Number(r.score), count: (best[uid]?.count ?? 0) + 1, last: r.created_at, name };
        } else {
          best[uid].count++;
          if (r.created_at > best[uid].last) best[uid].last = r.created_at;
        }
      });

      const sorted = Object.values(best).sort((a, b) => a.score - b.score);
      setRows(sorted.map((b, i) => ({
        rank: i + 1,
        team: b.name,
        score: b.score,
        submissions: b.count,
        lastSubmission: new Date(b.last).toLocaleString(),
      })));
    })();
  }, [id]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {id && (
                <Link to={`/competition/${id}`}>
                  <Button variant="ghost" className="mb-4">← Back to Competition</Button>
                </Link>
              )}
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-10 w-10 text-primary" />
                <div>
                  <h1 className="text-4xl font-bold">Leaderboard</h1>
                  <p className="text-muted-foreground">{competitionTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              {rows.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">No submissions yet.</CardContent></Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rows.slice(0, 3).map((entry) => (
                      <Card key={entry.rank} className={entry.rank === 1 ? "border-primary" : ""}>
                        <CardHeader className="text-center">
                          <div className="flex justify-center mb-2">{getRankIcon(entry.rank)}</div>
                          <CardTitle className="text-xl">{entry.team}</CardTitle>
                          <CardDescription>Rank #{entry.rank}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                          <div className="text-3xl font-bold text-primary">{entry.score.toFixed(4)}</div>
                          <div className="text-sm text-muted-foreground">{entry.submissions} submissions</div>
                          <Badge variant="secondary">{entry.lastSubmission}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Full Leaderboard</CardTitle>
                      <CardDescription>Ranked by score (lower is better)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">Rank</TableHead>
                            <TableHead>Team / User</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Last Submission</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows.map((entry) => (
                            <TableRow key={entry.rank} className={entry.rank <= 3 ? "bg-muted/50" : ""}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">{getRankIcon(entry.rank)}<span>#{entry.rank}</span></div>
                              </TableCell>
                              <TableCell className="font-medium">{entry.team}</TableCell>
                              <TableCell className="font-mono">{entry.score.toFixed(4)}</TableCell>
                              <TableCell>{entry.submissions}</TableCell>
                              <TableCell className="text-muted-foreground">{entry.lastSubmission}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
