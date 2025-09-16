"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Star, 
  Gift, 
  Coins, 
  Trophy,
  Target,
  Zap,
  Leaf,
  Recycle
} from "lucide-react";

export function RewardsPage() {
  const [rewards, setRewards] = useState({
    points: 1250,
    level: 3,
    nextLevelPoints: 1500,
    badges: [
      { id: 1, name: "Premier pas", icon: "🌱", description: "Première collecte réalisée", earned: true },
      { id: 2, name: "Éco-warrior", icon: "♻️", description: "10 collectes réalisées", earned: true },
      { id: 3, name: "Champion vert", icon: "🏆", description: "50kg de déchets collectés", earned: false }
    ],
    availableRewards: [
      { id: 1, name: "Bon d'achat 5€", cost: 500, description: "Utilisable chez nos partenaires" },
      { id: 2, name: "Sac réutilisable", cost: 750, description: "Sac écologique Collectam" },
      { id: 3, name: "Bon d'achat 10€", cost: 1000, description: "Utilisable chez nos partenaires" },
      { id: 4, name: "Consultation écologique", cost: 1500, description: "Audit environnemental gratuit" }
    ]
  });

  const progressToNextLevel = (rewards.points / rewards.nextLevelPoints) * 100;

  const redeemReward = (rewardId: number, cost: number) => {
    if (rewards.points >= cost) {
      setRewards(prev => ({
        ...prev,
        points: prev.points - cost
      }));
      // In a real app, you would call an API here
      alert("Récompense échangée avec succès !");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Récompenses</h1>
          <p className="text-muted-foreground">
            Gagnez des points et débloquez des récompenses exclusives
          </p>
        </div>
      </div>

      {/* Points et niveau */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points totaux</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rewards.points}</div>
            <p className="text-xs text-muted-foreground">
              +50 points cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau actuel</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Niveau {rewards.level}</div>
            <p className="text-xs text-muted-foreground">
              Éco-citoyen engagé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochain niveau</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.nextLevelPoints - rewards.points}</div>
            <p className="text-xs text-muted-foreground">points restants</p>
            <Progress value={progressToNextLevel} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mes Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {rewards.badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-4 border rounded-lg text-center ${
                  badge.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                {badge.earned && (
                  <Badge className="mt-2 bg-green-100 text-green-800">Obtenu</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Récompenses disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Boutique de récompenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.availableRewards.map((reward) => (
              <div key={reward.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    {reward.cost}
                  </Badge>
                </div>
                <Button
                  onClick={() => redeemReward(reward.id, reward.cost)}
                  disabled={rewards.points < reward.cost}
                  className="w-full mt-2"
                  variant={rewards.points >= reward.cost ? "default" : "secondary"}
                >
                  {rewards.points >= reward.cost ? "Échanger" : "Points insuffisants"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comment gagner des points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Comment gagner des points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Recycle className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium">Collecte de déchets</h4>
                <p className="text-sm text-muted-foreground">+10 points par kg collecté</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Star className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium">Première collecte du mois</h4>
                <p className="text-sm text-muted-foreground">+50 points bonus</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Leaf className="h-8 w-8 text-purple-600" />
              <div>
                <h4 className="font-medium">Tri parfait</h4>
                <p className="text-sm text-muted-foreground">+25 points pour un tri exemplaire</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Trophy className="h-8 w-8 text-orange-600" />
              <div>
                <h4 className="font-medium">Parrainage</h4>
                <p className="text-sm text-muted-foreground">+100 points par filleul actif</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
