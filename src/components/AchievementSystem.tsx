import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Star,
  Upload,
  Download,
  MessageSquare,
  Zap,
  Crown,
  Medal,
  Target,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const userStats = {
  xp: 2450,
  level: 12,
  nextLevelXp: 3000,
  rank: "Gold Researcher",
  streak: 7,
  totalBadges: 14,
};

const badges = [
  { icon: Upload, label: "Data Pioneer", description: "Uploaded 10+ datasets", earned: true, color: "text-primary" },
  { icon: Download, label: "Knowledge Seeker", description: "Downloaded 50+ datasets", earned: true, color: "text-blue-500" },
  { icon: MessageSquare, label: "Community Voice", description: "100+ discussion posts", earned: true, color: "text-purple-500" },
  { icon: Star, label: "Top Contributor", description: "Featured notebook author", earned: true, color: "text-secondary" },
  { icon: Flame, label: "On Fire", description: "7-day activity streak", earned: true, color: "text-orange-500" },
  { icon: Target, label: "Competition Pro", description: "Top 10 in 3 competitions", earned: true, color: "text-red-500" },
  { icon: Zap, label: "Speed Demon", description: "Submit within first hour", earned: false, color: "text-muted-foreground" },
  { icon: Crown, label: "Champion", description: "Win a competition", earned: false, color: "text-muted-foreground" },
];

const rankTiers = [
  { name: "Bronze Explorer", minXp: 0, color: "bg-amber-700" },
  { name: "Silver Analyst", minXp: 1000, color: "bg-gray-400" },
  { name: "Gold Researcher", minXp: 2000, color: "bg-yellow-500" },
  { name: "Platinum Scientist", minXp: 5000, color: "bg-cyan-400" },
  { name: "Diamond Expert", minXp: 10000, color: "bg-blue-400" },
];

const AchievementSystem = () => {
  const xpProgress = ((userStats.xp - 2000) / (userStats.nextLevelXp - 2000)) * 100;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Trophy className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Your Achievements</h2>
        </div>
        <p className="text-muted-foreground mb-8">
          Track your progress, earn badges, and climb the ranks
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* XP & Level Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-secondary" />
                Level {userStats.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-3">
                  <span className="text-3xl font-bold text-secondary">{userStats.level}</span>
                </div>
                <p className="font-semibold text-foreground">{userStats.rank}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">XP Progress</span>
                  <span className="font-medium text-foreground">{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <Progress value={xpProgress} className="h-2.5" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-foreground">{userStats.streak}-day streak</span>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Medal className="h-3 w-3" />
                  {userStats.totalBadges} badges
                </Badge>
              </div>

              {/* Rank Tiers */}
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank Tiers</p>
                {rankTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex items-center gap-2 text-xs ${
                      tier.name === userStats.rank ? "font-bold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${tier.color}`} />
                    <span>{tier.name}</span>
                    <span className="ml-auto">{tier.minXp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges Grid */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-secondary" />
                Badges Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <Tooltip key={badge.label}>
                    <TooltipTrigger>
                      <div
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          badge.earned
                            ? "border-border bg-card hover:shadow-md cursor-pointer"
                            : "border-dashed border-border/50 bg-muted/30 opacity-50"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${
                            badge.earned ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <badge.icon className={`h-6 w-6 ${badge.color}`} />
                        </div>
                        <span className="text-xs font-semibold text-center text-foreground">
                          {badge.label}
                        </span>
                        {!badge.earned && (
                          <Badge variant="outline" className="text-[10px]">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{badge.label}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AchievementSystem;
