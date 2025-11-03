import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User, LogOut, Settings, Heart, MessageCircle } from "lucide-react";
import Footer from "./Footer";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  city: string | null;
  profession: string | null;
  highest_qualification: string | null;
  religion: string | null;
  height: string | null;
  diet: string | null;
  marital_status: string | null;
  profile_photo_url?: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get('/auth');
        setCurrentUser(userData);
        const { data: profilesData } = await api.get('/profiles');
        setAllProfiles(profilesData.filter((p: Profile) => p.id !== userData.id));
      } catch (error) {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLike = async (profileId: string) => {
    try {
      await api.post(`/profiles/${profileId}/like`);
      toast({
        title: "Success!",
        description: "Profile liked successfully",
      });
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  const handleChat = (profileId: string) => {
    navigate(`/messages`);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div>
              <span className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#8B4513] group-hover:text-[#6B3410] transition-colors">MyShagun</span>
              <p className="text-xs text-muted-foreground font-['Poppins']">Where Hearts Connect</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => navigate("/browse")}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => navigate("/messages")}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-1 sm:gap-2 rounded-full font-['Poppins'] h-9 px-3 sm:h-10 sm:px-4 text-sm">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden border-primary/20 shadow-glow">
            <div className="bg-gradient-romantic p-6 sm:p-8 text-primary-foreground text-center">
              {currentUser?.profile_photo_url ? (
                <img 
                  src={currentUser.profile_photo_url} 
                  alt={`${currentUser.first_name} ${currentUser.last_name}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  <User className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold mb-1">
                {currentUser?.first_name} {currentUser?.last_name}
              </h2>
              <p className="text-sm sm:text-base opacity-90 font-['Poppins']">
                {currentUser?.profession || 'Professional'}
              </p>
            </div>
            
            <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">Age</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins']">
                    {currentUser?.date_of_birth ? getAge(currentUser.date_of_birth) : 'N/A'} years
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">Height</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins']">{currentUser?.height || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">City</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins']">{currentUser?.city ? `${currentUser.city}, USA` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">Religion</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins'] capitalize">{currentUser?.religion || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">Education</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins'] capitalize">
                    {currentUser?.highest_qualification?.replace('-', ' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground font-['Poppins'] mb-1 block">Diet</label>
                  <p className="text-base sm:text-lg font-semibold font-['Poppins'] capitalize">{currentUser?.diet || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
                      </Card>
          
                      <section className="mt-8 sm:mt-10">
                        <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-center mb-6 text-gray-800">
                          Discover Profiles ({allProfiles.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                          {allProfiles.map((profile) => (
                                              <Card key={profile.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 group">
                                                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200">
                                                  {profile.profile_photo_url ? (
                                                    <img
                                                      src={profile.profile_photo_url}
                                                      alt={`${profile.first_name} ${profile.last_name}`}
                                                      className="w-full h-full object-cover"
                                                    />
                                                  ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                      <User className="w-16 h-16 text-primary/60" />
                                                    </div>
                                                  )}
                                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                                                    <h4 className="text-xl font-['Playfair_Display'] font-bold text-white">
                                                      {profile.first_name} {profile.last_name}
                                                    </h4>
                                                  </div>
                                                </div>
                                                <CardContent className="p-4 space-y-2">
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">Age:</span> {profile.date_of_birth ? getAge(profile.date_of_birth) : 'N/A'}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">Profession:</span> {profile.profession || 'N/A'}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">City:</span> {profile.city || 'N/A'}
                                                  </p>
                                                  <div className="flex gap-2 mt-4">
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      className="flex-1 gap-1 border-[#8B4513]/30 hover:bg-[#8B4513]/5"
                                                      onClick={() => handleLike(profile.id)}
                                                    >
                                                      <Heart className="w-4 h-4" />
                                                      Like
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      className="flex-1 gap-1 bg-[#8B4513] hover:bg-[#6B3410]"
                                                      onClick={() => handleChat(profile.id)}
                                                    >
                                                      <MessageCircle className="w-4 h-4" />
                                                      Chat
                                                    </Button>
                                                  </div>
                                                </CardContent>                            </Card>
                          ))}
                        </div>
                      </section>
                    </div>
                  </main>
      <Footer />
    </div>
  );
};

export default Dashboard;