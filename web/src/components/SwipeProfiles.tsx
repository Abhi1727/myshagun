import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, MessageCircle, User, MapPin, Briefcase, GraduationCap } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  profession: string | null;
  highest_qualification: string | null;
  height: string | null;
  religion: string | null;
  diet: string | null;
  profile_photo_url: string | null;
}

const SwipeProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data } = await api.get('/profiles/featured');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];

    try {
      const { data } = await api.post('/chat/like', { likedUserId: profile.id });

      if (data.match) {
        toast({
          title: "🎉 It's a Match!",
          description: `You and ${profile.first_name} liked each other!`,
        });
        // Could navigate to chat here
      } else {
        toast({
          title: "Liked!",
          description: `You liked ${profile.first_name}'s profile`,
        });
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to like profile",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    setCurrentIndex(currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <Heart className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
        <p className="text-muted-foreground mb-4">Check back later for new matches!</p>
        <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
      </div>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
        {/* Profile Image */}
        <div className="relative h-96 bg-gradient-to-br from-pink-200 via-purple-200 to-red-200">
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={`${profile.first_name} ${profile.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-32 h-32 text-primary/40" />
            </div>
          )}

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">
              {profile.first_name} {profile.last_name}
              {profile.date_of_birth && `, ${getAge(profile.date_of_birth)}`}
            </h2>
            {profile.city && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{profile.city}{profile.state && `, ${profile.state}`}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <CardContent className="p-6 space-y-4">
          {profile.profession && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-medium">{profile.profession}</span>
            </div>
          )}

          {profile.highest_qualification && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="font-medium capitalize">
                {profile.highest_qualification.replace('-', ' ')}
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            {profile.height && (
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="font-semibold">{profile.height}</p>
              </div>
            )}
            {profile.religion && (
              <div>
                <p className="text-xs text-muted-foreground">Religion</p>
                <p className="font-semibold capitalize">{profile.religion}</p>
              </div>
            )}
            {profile.diet && (
              <div>
                <p className="text-xs text-muted-foreground">Diet</p>
                <p className="font-semibold capitalize">{profile.diet}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          onClick={handleSkip}
          className="rounded-full w-16 h-16 border-2 hover:border-red-500 hover:bg-red-50"
        >
          <X className="w-8 h-8 text-red-500" />
        </Button>

        <Button
          size="lg"
          onClick={handleLike}
          className="rounded-full w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          <Heart className="w-10 h-10" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center mt-6 text-sm text-muted-foreground">
        {currentIndex + 1} of {profiles.length}
      </div>
    </div>
  );
};

export default SwipeProfiles;
