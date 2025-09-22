"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Flag, Award, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Rating {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserType: 'menage' | 'collecteur' | 'entreprise';
  toUserId: string;
  toUserName: string;
  toUserType: 'menage' | 'collecteur' | 'entreprise';
  collectionId: string;
  rating: number; // 1-5 stars
  comment: string;
  categories: {
    punctuality: number;
    professionalism: number;
    quality: number;
    communication: number;
  };
  photos?: string[];
  createdAt: string;
  helpful: number;
  reported: boolean;
}

interface UserRatingStats {
  userId: string;
  userName: string;
  userType: string;
  averageRating: number;
  totalRatings: number;
  categoryAverages: {
    punctuality: number;
    professionalism: number;
    quality: number;
    communication: number;
  };
  recentRatings: Rating[];
  badges: Array<{
    type: 'excellence' | 'reliability' | 'speed' | 'communication';
    name: string;
    description: string;
    earnedAt: string;
  }>;
}

interface RatingSystemProps {
  userId?: string;
  collectionId?: string;
  mode: 'view' | 'rate' | 'manage';
  className?: string;
}

export function RatingSystem({ userId, collectionId, mode, className }: RatingSystemProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userStats, setUserStats] = useState<UserRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState({
    rating: 0,
    comment: '',
    categories: {
      punctuality: 0,
      professionalism: 0,
      quality: 0,
      communication: 0
    }
  });

  useEffect(() => {
    if (mode === 'view' && userId) {
      loadUserRatings();
    } else if (mode === 'manage') {
      loadAllRatings();
    }
  }, [userId, mode]);

  const loadUserRatings = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls
      // const response = await fetch(`/api/ratings/user/${userId}`);
      // const stats = await response.json();
      
      // For now, start with empty data
      const emptyStats: UserRatingStats = {
        userId: userId || '1',
        userName: 'Utilisateur',
        userType: 'collecteur',
        averageRating: 0,
        totalRatings: 0,
        categoryAverages: {
          punctuality: 0,
          professionalism: 0,
          quality: 0,
          communication: 0
        },
        recentRatings: [],
        badges: []
      };

      setUserStats(emptyStats);
      setRatings([]);
    } catch (error) {
      console.error('❌ Failed to load ratings:', error);
      toast.error('Impossible de charger les évaluations');
    } finally {
      setLoading(false);
    }
  };

  const loadAllRatings = async () => {
    setLoading(true);
    try {
      // Mock data for management view
      const mockRatings: Rating[] = [
        // Add more mock ratings for management
      ];
      setRatings(mockRatings);
    } catch (error) {
      console.error('❌ Failed to load all ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (newRating.rating === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    try {
      // In production, submit to API
      console.log('📝 Submitting rating:', newRating);
      
      toast.success('Évaluation soumise avec succès');
      setShowRatingForm(false);
      setNewRating({
        rating: 0,
        comment: '',
        categories: {
          punctuality: 0,
          professionalism: 0,
          quality: 0,
          communication: 0
        }
      });
    } catch (error) {
      console.error('❌ Failed to submit rating:', error);
      toast.error('Erreur lors de la soumission');
    }
  };

  const markHelpful = async (ratingId: string) => {
    try {
      // In production, update via API
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId 
          ? { ...rating, helpful: rating.helpful + 1 }
          : rating
      ));
      toast.success('Merci pour votre feedback');
    } catch (error) {
      console.error('❌ Failed to mark helpful:', error);
    }
  };

  const reportRating = async (ratingId: string) => {
    try {
      // In production, report via API
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId 
          ? { ...rating, reported: true }
          : rating
      ));
      toast.success('Évaluation signalée');
    } catch (error) {
      console.error('❌ Failed to report rating:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
        {!interactive && <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>}
      </div>
    );
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'excellence': return <Award className="h-4 w-4" />;
      case 'reliability': return <Star className="h-4 w-4" />;
      case 'speed': return <TrendingUp className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'excellence': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reliability': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'speed': return 'bg-green-100 text-green-800 border-green-200';
      case 'communication': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Chargement des évaluations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'rate') {
    return (
      <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
        <DialogTrigger asChild>
          <Button>
            <Star className="h-4 w-4 mr-2" />
            Évaluer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Évaluer la collecte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Note générale</label>
              {renderStars(newRating.rating, true, (rating) => 
                setNewRating(prev => ({ ...prev, rating }))
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Évaluation détaillée</label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ponctualité</span>
                  {renderStars(newRating.categories.punctuality, true, (rating) =>
                    setNewRating(prev => ({
                      ...prev,
                      categories: { ...prev.categories, punctuality: rating }
                    }))
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Professionnalisme</span>
                  {renderStars(newRating.categories.professionalism, true, (rating) =>
                    setNewRating(prev => ({
                      ...prev,
                      categories: { ...prev.categories, professionalism: rating }
                    }))
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Qualité du service</span>
                  {renderStars(newRating.categories.quality, true, (rating) =>
                    setNewRating(prev => ({
                      ...prev,
                      categories: { ...prev.categories, quality: rating }
                    }))
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Communication</span>
                  {renderStars(newRating.categories.communication, true, (rating) =>
                    setNewRating(prev => ({
                      ...prev,
                      categories: { ...prev.categories, communication: rating }
                    }))
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Commentaire (optionnel)</label>
              <Textarea
                value={newRating.comment}
                onChange={(e) => setNewRating(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Partagez votre expérience..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={submitRating} className="flex-1">
                Soumettre l'évaluation
              </Button>
              <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={className}>
      {mode === 'view' && userStats && (
        <>
          {/* User Rating Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Profil d'Évaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {userStats.averageRating.toFixed(1)}
                  </div>
                  {renderStars(userStats.averageRating)}
                  <p className="text-sm text-muted-foreground mt-1">
                    {userStats.totalRatings} évaluations
                  </p>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ponctualité</span>
                        <span>{userStats.categoryAverages.punctuality.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.categoryAverages.punctuality / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Professionnalisme</span>
                        <span>{userStats.categoryAverages.professionalism.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.categoryAverages.professionalism / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Qualité</span>
                        <span>{userStats.categoryAverages.quality.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.categoryAverages.quality / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span>{userStats.categoryAverages.communication.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(userStats.categoryAverages.communication / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {userStats.badges.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Badges Obtenus</h4>
                  <div className="flex flex-wrap gap-2">
                    {userStats.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`${getBadgeColor(badge.type)} flex items-center gap-1`}
                      >
                        {getBadgeIcon(badge.type)}
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Évaluations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {rating.fromUserName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{rating.fromUserName}</p>
                          <div className="flex items-center gap-2">
                            {renderStars(rating.rating)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {rating.fromUserType === 'menage' ? 'Ménage' : 'Collecteur'}
                      </Badge>
                    </div>

                    {rating.comment && (
                      <p className="text-sm text-muted-foreground mb-3">
                        "{rating.comment}"
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Ponctualité: {rating.categories.punctuality}/5</span>
                        <span>Professionnalisme: {rating.categories.professionalism}/5</span>
                        <span>Qualité: {rating.categories.quality}/5</span>
                        <span>Communication: {rating.categories.communication}/5</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markHelpful(rating.id)}
                          className="h-8 px-2"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {rating.helpful}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => reportRating(rating.id)}
                          className="h-8 px-2"
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
