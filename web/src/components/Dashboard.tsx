import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User, LogOut, Heart, MessageCircle, UserPlus, Edit2, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react";
import Footer from "./Footer";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  city: string | null;
  state: string | null;
  profession: string | null;
  highest_qualification: string | null;
  religion: string | null;
  height: string | null;
  diet: string | null;
  marital_status: string | null;
  profile_photo_url?: string | null;
  bio?: string | null;
  smoking?: string | null;
  drinking?: string | null;
  mobile_number?: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [likedByProfiles, setLikedByProfiles] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const { data: userData } = await api.get('/auth');
      setCurrentUser(userData);
      setEditForm(userData);

      const { data: profilesData } = await api.get('/profiles');
      setAllProfiles(profilesData.filter((p: Profile) => p.id !== userData.id));

      const { data: likesData } = await api.get('/profiles/likes/received');
      setLikedByProfiles(likesData);

      const { data: connectionsData } = await api.get('/profiles/connections');
      setConnections(connectionsData);
    } catch (error) {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (profileId: string) => {
    try {
      await api.post(`/profiles/like/${profileId}`);
      toast({
        title: "Success!",
        description: "Profile liked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to like profile",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async (profileId: string) => {
    try {
      await api.post(`/profiles/connect/${profileId}`);
      toast({
        title: "Connected!",
        description: "You are now connected with this profile",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to connect",
        variant: "destructive",
      });
    }
  };

  const handleChat = (profileId: string) => {
    navigate(`/messages?profileId=${profileId}`);
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await api.put('/profiles/me', editForm);
      setCurrentUser(data);
      setEditDialogOpen(false);
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
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
      <header className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div>
              <span className="text-3xl font-['Playfair_Display'] font-bold text-[#8B4513] group-hover:text-[#6B3410] transition-colors">MyShagun</span>
              <p className="text-xs text-muted-foreground font-['Poppins']">Where Hearts Connect</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2 rounded-full font-['Poppins'] h-12 px-6 text-base font-semibold border-2 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-16 mb-8 bg-white shadow-lg rounded-xl">
            <TabsTrigger value="profile" className="text-base font-semibold data-[state=active]:bg-[#8B4513] data-[state=active]:text-white h-full rounded-lg">
              My Profile
            </TabsTrigger>
            <TabsTrigger value="liked" className="text-base font-semibold data-[state=active]:bg-[#8B4513] data-[state=active]:text-white h-full rounded-lg">
              Who Liked Me ({likedByProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="browse" className="text-base font-semibold data-[state=active]:bg-[#8B4513] data-[state=active]:text-white h-full rounded-lg">
              Browse Profiles ({allProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-base font-semibold data-[state=active]:bg-[#8B4513] data-[state=active]:text-white h-full rounded-lg">
              My Connections ({connections.length})
            </TabsTrigger>
          </TabsList>

          {/* My Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <Card className="overflow-hidden border-primary/20 shadow-2xl">
              <div className="bg-gradient-romantic p-10 text-primary-foreground">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-6">
                    {currentUser?.profile_photo_url ? (
                      <img
                        src={currentUser.profile_photo_url}
                        alt={`${currentUser.first_name} ${currentUser.last_name}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                        <User className="w-16 h-16" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-4xl font-['Playfair_Display'] font-bold mb-2">
                        {currentUser?.first_name} {currentUser?.last_name}
                      </h2>
                      <p className="text-xl opacity-90 font-['Poppins'] flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {currentUser?.profession || 'Professional'}
                      </p>
                      <p className="text-lg opacity-90 font-['Poppins'] flex items-center gap-2 mt-1">
                        <MapPin className="w-5 h-5" />
                        {currentUser?.city || 'N/A'}, {currentUser?.state || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2 bg-white text-[#8B4513] hover:bg-white/90 font-semibold text-base h-12 px-6">
                        <Edit2 className="w-5 h-5" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-['Playfair_Display']">Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={editForm.first_name || ''}
                            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editForm.last_name || ''}
                            onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={editForm.city || ''}
                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={editForm.state || ''}
                            onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="profession">Profession</Label>
                          <Input
                            id="profession"
                            value={editForm.profession || ''}
                            onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height</Label>
                          <Select value={editForm.height || ''} onValueChange={(v) => setEditForm({...editForm, height: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select height" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4'6&quot;">4'6"</SelectItem>
                              <SelectItem value="4'7&quot;">4'7"</SelectItem>
                              <SelectItem value="4'8&quot;">4'8"</SelectItem>
                              <SelectItem value="4'9&quot;">4'9"</SelectItem>
                              <SelectItem value="4'10&quot;">4'10"</SelectItem>
                              <SelectItem value="4'11&quot;">4'11"</SelectItem>
                              <SelectItem value="5'0&quot;">5'0"</SelectItem>
                              <SelectItem value="5'1&quot;">5'1"</SelectItem>
                              <SelectItem value="5'2&quot;">5'2"</SelectItem>
                              <SelectItem value="5'3&quot;">5'3"</SelectItem>
                              <SelectItem value="5'4&quot;">5'4"</SelectItem>
                              <SelectItem value="5'5&quot;">5'5"</SelectItem>
                              <SelectItem value="5'6&quot;">5'6"</SelectItem>
                              <SelectItem value="5'7&quot;">5'7"</SelectItem>
                              <SelectItem value="5'8&quot;">5'8"</SelectItem>
                              <SelectItem value="5'9&quot;">5'9"</SelectItem>
                              <SelectItem value="5'10&quot;">5'10"</SelectItem>
                              <SelectItem value="5'11&quot;">5'11"</SelectItem>
                              <SelectItem value="6'0&quot;">6'0"</SelectItem>
                              <SelectItem value="6'1&quot;">6'1"</SelectItem>
                              <SelectItem value="6'2&quot;">6'2"</SelectItem>
                              <SelectItem value="6'3&quot;">6'3"</SelectItem>
                              <SelectItem value="6'4&quot;">6'4"</SelectItem>
                              <SelectItem value="6'5&quot;">6'5"</SelectItem>
                              <SelectItem value="6'6&quot;">6'6"+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="religion">Religion</Label>
                          <Select value={editForm.religion || ''} onValueChange={(v) => setEditForm({...editForm, religion: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select religion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hindu">Hindu</SelectItem>
                              <SelectItem value="muslim">Muslim</SelectItem>
                              <SelectItem value="christian">Christian</SelectItem>
                              <SelectItem value="sikh">Sikh</SelectItem>
                              <SelectItem value="buddhist">Buddhist</SelectItem>
                              <SelectItem value="jain">Jain</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="maritalStatus">Marital Status</Label>
                          <Select value={editForm.marital_status || ''} onValueChange={(v) => setEditForm({...editForm, marital_status: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never_married">Never Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="separated">Separated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="diet">Diet</Label>
                          <Select value={editForm.diet || ''} onValueChange={(v) => setEditForm({...editForm, diet: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select diet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                              <SelectItem value="eggetarian">Eggetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="smoking">Smoking</Label>
                          <Select value={editForm.smoking || ''} onValueChange={(v) => setEditForm({...editForm, smoking: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value="occasionally">Occasionally</SelectItem>
                              <SelectItem value="regularly">Regularly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="drinking">Drinking</Label>
                          <Select value={editForm.drinking || ''} onValueChange={(v) => setEditForm({...editForm, drinking: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value="occasionally">Occasionally</SelectItem>
                              <SelectItem value="regularly">Regularly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="qualification">Highest Qualification</Label>
                          <Select value={editForm.highest_qualification || ''} onValueChange={(v) => setEditForm({...editForm, highest_qualification: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high_school">High School</SelectItem>
                              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="masters">Master's Degree</SelectItem>
                              <SelectItem value="doctorate">Doctorate</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            rows={4}
                          />
                        </div>
                      </div>
                      <Button onClick={handleUpdateProfile} size="lg" className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-lg h-12">
                        Save Changes
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Age</label>
                    <p className="text-2xl font-semibold font-['Poppins']">
                      {currentUser?.date_of_birth ? getAge(currentUser.date_of_birth) : 'N/A'} years
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Height</label>
                    <p className="text-2xl font-semibold font-['Poppins']">{currentUser?.height || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Religion</label>
                    <p className="text-2xl font-semibold font-['Poppins'] capitalize">{currentUser?.religion || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Education</label>
                    <p className="text-xl font-semibold font-['Poppins'] capitalize">
                      {currentUser?.highest_qualification?.replace('-', ' ') || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Diet</label>
                    <p className="text-2xl font-semibold font-['Poppins'] capitalize">{currentUser?.diet || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-muted-foreground font-['Poppins'] mb-2 block">Marital Status</label>
                    <p className="text-xl font-semibold font-['Poppins'] capitalize">{currentUser?.marital_status || 'N/A'}</p>
                  </div>
                </div>
                {currentUser?.bio && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold font-['Poppins'] mb-2">About Me</h3>
                    <p className="text-gray-700 font-['Poppins']">{currentUser.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Who Liked Me Tab */}
          <TabsContent value="liked" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedByProfiles.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-gray-600 mb-2">No Likes Yet</h3>
                  <p className="text-gray-500 font-['Poppins']">When someone likes your profile, they'll appear here</p>
                </div>
              ) : (
                likedByProfiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-pink-200">
                    <div className="relative h-64 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200">
                      {profile.profile_photo_url ? (
                        <img
                          src={profile.profile_photo_url}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-white" />
                        Liked You
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                        <div>
                          <h4 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                            {profile.first_name} {profile.last_name}
                          </h4>
                          <p className="text-white/90 font-['Poppins']">
                            {profile.date_of_birth ? `${getAge(profile.date_of_birth)} years` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-semibold">Profession:</span> {profile.profession || 'N/A'}
                        </p>
                        <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-semibold">Location:</span> {profile.city || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          size="lg"
                          className="flex-1 gap-2 bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold text-base h-14"
                          onClick={() => handleConnect(profile.id)}
                        >
                          <UserPlus className="w-5 h-5" />
                          Connect
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="flex-1 gap-2 border-2 border-[#8B4513]/30 hover:bg-[#8B4513]/5 font-semibold text-base h-14"
                          onClick={() => handleChat(profile.id)}
                        >
                          <MessageCircle className="w-5 h-5" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Browse Profiles Tab */}
          <TabsContent value="browse" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProfiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
                  <div className="relative h-64 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200">
                    {profile.profile_photo_url ? (
                      <img
                        src={profile.profile_photo_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-primary/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                      <div>
                        <h4 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                          {profile.first_name} {profile.last_name}
                        </h4>
                        <p className="text-white/90 font-['Poppins']">
                          {profile.date_of_birth ? `${getAge(profile.date_of_birth)} years` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-semibold">Profession:</span> {profile.profession || 'N/A'}
                      </p>
                      <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">Location:</span> {profile.city || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 gap-2 border-2 border-pink-300 hover:bg-pink-50 font-semibold text-base h-14"
                        onClick={() => handleLike(profile.id)}
                      >
                        <Heart className="w-5 h-5" />
                        Like
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 gap-2 bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold text-base h-14"
                        onClick={() => handleConnect(profile.id)}
                      >
                        <UserPlus className="w-5 h-5" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Connections Tab */}
          <TabsContent value="connections" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <UserPlus className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-gray-600 mb-2">No Connections Yet</h3>
                  <p className="text-gray-500 font-['Poppins']">Start connecting with profiles to see them here</p>
                </div>
              ) : (
                connections.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-200">
                    <div className="relative h-64 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200">
                      {profile.profile_photo_url ? (
                        <img
                          src={profile.profile_photo_url}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Connected
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                        <div>
                          <h4 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                            {profile.first_name} {profile.last_name}
                          </h4>
                          <p className="text-white/90 font-['Poppins']">
                            {profile.date_of_birth ? `${getAge(profile.date_of_birth)} years` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-semibold">Profession:</span> {profile.profession || 'N/A'}
                        </p>
                        <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-semibold">Location:</span> {profile.city || 'N/A'}
                        </p>
                        {profile.mobile_number && (
                          <p className="text-base text-gray-700 font-['Poppins'] flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="font-semibold">Contact:</span> {profile.mobile_number}
                          </p>
                        )}
                      </div>
                      <Button
                        size="lg"
                        className="w-full gap-2 bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold text-base h-14"
                        onClick={() => handleChat(profile.id)}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
