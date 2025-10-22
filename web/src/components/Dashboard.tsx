import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User, LogOut, Settings } from "lucide-react";
import logo from "@/assets/logo.png";

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

import { getFeaturedProfiles } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get('/auth');
        setCurrentUser(userData);
        const { data: profilesData } = await getFeaturedProfiles();
        setFeaturedProfiles(profilesData);
      } catch (error) {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
              <img src={logo} alt="MyShagun Logo" className="relative w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-primary/30 shadow-lg" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-['Playfair_Display'] font-bold bg-gradient-romantic bg-clip-text text-transparent">MyShagun</span>
              <p className="text-xs text-muted-foreground font-['Poppins'] hidden xs:block">Dashboard</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
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
                        <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-center mb-6 text-gray-800">Featured Profiles</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                          {featuredProfiles.map((profile) => (
                                              <Card key={profile.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-primary/20 relative group">
                                                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 flex items-center justify-center">
                                                  {profile.profile_photo_url ? (
                                                    <img 
                                                      src={profile.profile_photo_url} 
                                                      alt={`${profile.first_name} ${profile.last_name}`}
                                                      className="w-full h-full object-cover absolute inset-0 blur-sm group-hover:blur-none transition-all duration-300"
                                                    />
                                                  ) : (
                                                    <User className="w-16 h-16 text-primary/60" />
                                                  )}
                                                  <div className="absolute inset-0 bg-black/40 flex items-end p-3 sm:p-4 group-hover:bg-black/20 transition-all duration-300">
                                                    <h4 className="text-lg sm:text-xl font-['Playfair_Display'] font-bold text-white leading-tight">
                                                      {profile.first_name} {profile.last_name}
                                                    </h4>
                                                  </div>
                                                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/40 transition-all duration-300 opacity-100 group-hover:opacity-0">
                                                    <Button className="bg-white text-primary hover:bg-gray-100 font-bold py-2 px-4 rounded-full shadow-lg">View Premium</Button>
                                                  </div>
                                                </div>
                                                <CardContent className="p-4 sm:p-5 space-y-2 opacity-20 group-hover:opacity-100 transition-all duration-300">
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">Age:</span> {profile.date_of_birth ? getAge(profile.date_of_birth) : 'N/A'}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">Profession:</span> {profile.profession || 'N/A'}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground font-['Poppins']">
                                                    <span className="font-semibold text-gray-700">City:</span> {profile.city || 'N/A'}
                                                  </p>
                                                </CardContent>                            </Card>
                          ))}
                        </div>
                      </section>
                    </div>
                  </main>    </div>
  );
};

export default Dashboard;