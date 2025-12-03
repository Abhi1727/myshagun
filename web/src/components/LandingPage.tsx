import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  Users,
  Shield,
  Sparkles,
  Star,
  Lock,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  MapPin,
  Briefcase,
  Calendar,
  Ruler,
} from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import Footer from "./Footer";
import heroImage from "@/assets/hero-couple.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import profileSarah from "@/assets/profile-sarah.jpg";
import profileMichael from "@/assets/profile-michael.jpg";
import profilePriya from "@/assets/profile-priya.jpg";
import profileRahul from "@/assets/profile-rahul.jpg";
import profileEmma from "@/assets/profile-emma.jpg";
import profileJames from "@/assets/profile-james.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import api, { register } from "@/lib/api";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  city: string | null;
  living_in: string | null;
  profession: string | null;
  marital_status: string | null;
  height: string | null;
  religion: string | null;
  profile_photo_url: string | null;
}

// Mock profiles as fallback when backend is not available
const mockProfiles: Profile[] = [
  {
    id: "mock-1",
    first_name: "Sarah",
    last_name: "Johnson",
    date_of_birth: "1995-06-15",
    city: "New York",
    living_in: "USA",
    profession: "Software Engineer",
    marital_status: "Never Married",
    height: "5'6\"",
    religion: "Christian",
    profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: "mock-2",
    first_name: "Michael",
    last_name: "Smith",
    date_of_birth: "1992-03-22",
    city: "Los Angeles",
    living_in: "USA",
    profession: "Business Analyst",
    marital_status: "Never Married",
    height: "5'11\"",
    religion: "Hindu",
    profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: "mock-3",
    first_name: "Priya",
    last_name: "Sharma",
    date_of_birth: "1996-09-10",
    city: "Chicago",
    living_in: "USA",
    profession: "Doctor",
    marital_status: "Never Married",
    height: "5'5\"",
    religion: "Hindu",
    profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: "mock-4",
    first_name: "Rahul",
    last_name: "Patel",
    date_of_birth: "1993-11-28",
    city: "San Francisco",
    living_in: "USA",
    profession: "Product Manager",
    marital_status: "Never Married",
    height: "5'10\"",
    religion: "Hindu",
    profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: "mock-5",
    first_name: "Emma",
    last_name: "Williams",
    date_of_birth: "1994-07-05",
    city: "Boston",
    living_in: "USA",
    profession: "Marketing Manager",
    marital_status: "Never Married",
    height: "5'7\"",
    religion: "Christian",
    profile_photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: "mock-6",
    first_name: "James",
    last_name: "Brown",
    date_of_birth: "1991-12-18",
    city: "Seattle",
    living_in: "USA",
    profession: "Data Scientist",
    marital_status: "Never Married",
    height: "6'0\"",
    religion: "Muslim",
    profile_photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRegistration, setShowRegistration] = useState(false);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  // Stats counter state - commented out for future use
  // const [statsVisible, setStatsVisible] = useState(false);
  // const [stats, setStats] = useState({ matches: 0, users: 0, success: 0 });

  useEffect(() => {
    fetchFeaturedProfiles();

    const timer = setTimeout(() => {
      setShowRegistration(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  // Animated stats counter useEffect - commented out for future use
  /* useEffect(() => {
    if (statsVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          matches: Math.floor(6000000 * progress),
          users: Math.floor(100000 * progress),
          success: Math.floor(98 * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats({ matches: 6000000, users: 100000, success: 98 });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [statsVisible]); */

  const fetchFeaturedProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const { data } = await api.get('/profiles/featured');
      setFeaturedProfiles(data && data.length > 0 ? data : mockProfiles);
    } catch (error) {
      console.error("Failed to fetch profiles from backend, using mock profiles:", error);
      // Use mock profiles as fallback when backend is not available
      setFeaturedProfiles(mockProfiles);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ firstName, lastName, email, password });
      localStorage.setItem("token", data.token);
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.errors?.[0]?.msg || error.response?.data?.details || "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoginLoading(true);

    try {
      const { data } = await api.post('/auth', { email, password });
      localStorage.setItem('token', data.token);

      // Store "keep logged in" preference
      if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('keepLoggedIn');
        localStorage.removeItem('userEmail');
      }

      toast({
        title: "Success!",
        description: "Logged in successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.errors?.[0]?.msg || error.response?.data?.msg || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
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

  const getPartialName = (firstName: string) => {
    if (!firstName) return "";
    return `${firstName.substring(0, 2)}****`;
  };

  return (
    <div className="min-h-screen bg-gradient-warm overflow-hidden relative">
      {/* Romantic Background Overlay */}
      <div className="fixed inset-0 bg-romantic-gradient pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-heart-pattern pointer-events-none z-0"></div>

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="absolute text-pink-400/20 animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 30}px`,
              height: `${15 + Math.random() * 30}px`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Twinkling Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={`twinkle-${i}`}
            className="absolute text-pink-300/30 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              animationDelay: `${i * 0.3}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Rose Petals Falling */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute animate-petal-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-300/40 to-rose-400/40 blur-sm"
            ></div>
          </div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-200/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <div
        className="relative overflow-hidden bg-white flex flex-col min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        {/* Elegant Navigation */}
        <nav className="relative z-10 bg-white border-b border-border/50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
                <div>
                  <span className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#8B4513] group-hover:text-[#6B3410] transition-colors">
                    MyShagun
                  </span>
                  <p className="text-xs text-muted-foreground font-['Poppins']">Where Hearts Connect</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => navigate("/")}
                  className="font-['Poppins'] text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-['Poppins'] text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium"
                >
                  Membership
                </button>
                <button
                  onClick={() => navigate("/contact-us")}
                  className="font-['Poppins'] text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium"
                >
                  Contact Us
                </button>
                <Button
                  variant="default"
                  onClick={() => navigate("/auth")}
                  className="font-['Poppins'] bg-[#8B4513] hover:bg-[#6B3410] text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>

              {/* Mobile Navigation Button */}
              <div className="md:hidden">
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="font-['Poppins'] border-[#8B4513]/30 hover:bg-[#8B4513]/5 text-[#8B4513]"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center py-12 sm:py-20">
          {/* Romantic Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large Floating Hearts */}
            {[...Array(8)].map((_, i) => (
              <Heart
                key={`hero-heart-${i}`}
                className="absolute text-pink-300/25 animate-drift"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  animationDelay: `${i * 1}s`,
                }}
                fill="currentColor"
              />
            ))}

            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <Sparkles
                key={`sparkle-${i}`}
                className="absolute text-amber-300/40 animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${12 + Math.random() * 20}px`,
                  height: `${12 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-1 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
              <div className="animate-fade-in text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-['Poppins'] font-medium text-white">
                    America's Most Trusted Matrimony Platform
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold leading-tight">
                  <span className="block text-white">
                    Find Your Soulmate
                  </span>
                </h1>

                <div className="space-y-4">
                  <p className="text-2xl sm:text-3xl font-bold text-white font-['Poppins']">
                    Millions of Single Women & Men Profiles
                  </p>

                  <p className="text-base sm:text-lg text-white/80 leading-relaxed font-['Poppins']">
                    Where destiny meets technology, Join the most trusted platform for meaningful connections and
                    beautiful beginnings.
                  </p>

                  <p className="text-base sm:text-lg text-white font-semibold font-['Poppins'] flex items-center justify-center lg:justify-start gap-2">
                    Your forever starts here.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Button
                    size="lg"
                    className="bg-[#8B4513] hover:bg-[#6B3410] text-white transition-all shadow-lg text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-full font-['Poppins'] font-semibold hover:scale-105 transform"
                    onClick={() => setShowRegistration(true)}
                  >
                    <Heart className="mr-2 w-5 h-5 fill-current" />
                    Start Your Journey
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-full font-['Poppins'] border-2 border-white bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm"
                    onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Now Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-pink-50/40 via-white to-rose-50/30 relative overflow-hidden">
        {/* Background Hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={`reg-heart-${i}`}
              className="absolute text-pink-200/20 animate-drift"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + Math.random() * 60}%`,
                width: `${30 + Math.random() * 40}px`,
                height: `${30 + Math.random() * 40}px`,
                animationDelay: `${i * 1.5}s`,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-center mb-4 text-foreground">
              Register Now
            </h2>
            <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto font-['Poppins']">
              Create your account in just a few seconds and start your journey to find your soulmate.
            </p>
          </div>
          <Card className="max-w-2xl mx-auto p-8 shadow-lg animate-scale-in animation-delay-200">
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-6">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8 text-center">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Register
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Animated Stats Counter - Commented out for future use */}
      {/* <section
        className="py-20 bg-gradient-to-br from-[#8B4513]/5 via-pink-50/50 to-purple-50/30 relative overflow-hidden"
        onMouseEnter={() => !statsVisible && setStatsVisible(true)}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-['Playfair_Display'] font-bold text-foreground mb-4">
              Trusted by Millions
            </h2>
            <p className="text-lg text-muted-foreground font-['Poppins']">
              Join the fastest-growing matrimonial platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-[#8B4513]/10 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl font-bold text-[#8B4513] mb-2 font-['Playfair_Display']">
                {stats.matches > 0 ? `${(stats.matches / 1000000).toFixed(1)}M+` : '6M+'}
              </div>
              <div className="text-lg font-semibold text-foreground font-['Poppins']">Happy Matches</div>
              <div className="text-sm text-muted-foreground font-['Poppins'] mt-1">Successful connections made</div>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-[#8B4513]/10 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl font-bold text-[#8B4513] mb-2 font-['Playfair_Display']">
                {stats.users > 0 ? `${(stats.users / 1000).toFixed(0)}K+` : '100K+'}
              </div>
              <div className="text-lg font-semibold text-foreground font-['Poppins']">Active Users</div>
              <div className="text-sm text-muted-foreground font-['Poppins'] mt-1">Looking for their soulmate</div>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-[#8B4513]/10 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl font-bold text-[#8B4513] mb-2 font-['Playfair_Display']">
                {stats.success > 0 ? `${stats.success}%` : '98%'}
              </div>
              <div className="text-lg font-semibold text-foreground font-['Poppins']">Success Rate</div>
              <div className="text-sm text-muted-foreground font-['Poppins'] mt-1">Find their perfect match</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Why Register Features */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="group text-center bg-primary/5 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-700 stroke-[2.5]" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground font-['Poppins'] mb-1">No.1 rated site</div>
              <div className="text-sm sm:text-base text-muted-foreground font-['Poppins']">Most recommended</div>
            </div>

            <div className="group text-center bg-primary/5 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-700 stroke-[2.5]" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground font-['Poppins'] mb-1">History of success</div>
              <div className="text-sm sm:text-base text-muted-foreground font-['Poppins']">6M+ Matches</div>
            </div>

            <div className="group text-center bg-primary/5 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-orange-700 stroke-[2.5]" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground font-['Poppins'] mb-1">100% Privacy</div>
              <div className="text-sm sm:text-base text-muted-foreground font-['Poppins']">Full control</div>
            </div>

            <div className="group text-center bg-primary/5 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-700 stroke-[2.5]" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground font-['Poppins'] mb-1">Fully secure</div>
              <div className="text-sm sm:text-base text-muted-foreground font-['Poppins']">Patent pending</div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-gradient-to-br from-rose-50/30 via-pink-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,182,193,0.15),transparent)]"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`feature-elem-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {i % 2 === 0 ? (
                <Heart
                  className="text-pink-300/15 animate-pulse-glow"
                  style={{
                    width: `${25 + Math.random() * 35}px`,
                    height: `${25 + Math.random() * 35}px`,
                    animationDelay: `${i * 0.7}s`,
                  }}
                  fill="currentColor"
                />
              ) : (
                <Sparkles
                  className="text-rose-300/20 animate-twinkle"
                  style={{
                    width: `${20 + Math.random() * 30}px`,
                    height: `${20 + Math.random() * 30}px`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-sm font-['Poppins'] font-medium text-primary">Premium Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-center mb-4 text-foreground">
              Why Lovebirds Choose Us?
            </h2>
            <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto font-['Poppins']">
              Experience the perfect blend of tradition and technology
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-card p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-2 animate-fade-in animation-delay-200">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-3 text-card-foreground">
                Verified Profiles
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-['Poppins']">
                100% authenticated members with ID verification for your peace of mind.
              </p>
            </div>

            <div className="group bg-card p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-2 animate-fade-in animation-delay-400">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-3 text-card-foreground">Privacy Shield</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-['Poppins']">
                Bank-level encryption keeps your personal information completely secure.
              </p>
            </div>

            <div className="group bg-card p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-2 animate-fade-in animation-delay-600">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-3 text-card-foreground">AI Matching</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-['Poppins']">
                Smart algorithms find your perfect match based on deep compatibility.
              </p>
            </div>

            <div className="group bg-card p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-2 animate-fade-in animation-delay-800">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-3 text-card-foreground">24/7 Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-['Poppins']">
                Dedicated relationship experts available anytime to guide your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-white via-pink-50/20 to-rose-50/25 relative overflow-hidden">
        {/* Romantic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-200/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

          {[...Array(10)].map((_, i) => (
            <Heart
              key={`profile-heart-${i}`}
              className="absolute text-pink-200/20 animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${12 + Math.random() * 20}px`,
                height: `${12 + Math.random() * 20}px`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${18 + Math.random() * 8}s`,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-primary fill-current animate-float" />
              <span className="text-sm font-['Poppins'] font-medium text-primary">Find Your Soulmate</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold mb-4">
              Your Perfect Life Partner Awaits
            </h2>
          <p className="text-lg text-muted-foreground font-['Poppins']">
            Connect with verified profiles looking for meaningful relationships
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {loadingProfiles ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-muted-foreground font-['Poppins']">Loading amazing profiles for you...</p>
            </div>
          ) : featuredProfiles.length > 0 && (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredProfiles.map((profile) => (
                <CarouselItem key={profile.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                  <Card className="overflow-hidden transition-all duration-500 group border-2 border-transparent hover:border-primary/50 hover:shadow-2xl hover:scale-105 transform">
                    <div className="relative">
                      <img
                        src={profile.profile_photo_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&q=80"}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-60 object-cover filter blur-[8px] brightness-90"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                      <div className="absolute inset-0 backdrop-blur-sm"></div>
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Premium
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Private
                      </div>
                    </div>
                    <div className="p-4 text-center bg-white">
                      <h3 className="text-lg font-bold">{getPartialName(profile.first_name)}</h3>
                      <p className="text-sm text-muted-foreground h-10">
                        {getAge(profile.date_of_birth)} yrs, {profile.height}, {profile.religion}, {profile.city}
                      </p>
                      <Button className="mt-4 w-full" onClick={() => setShowRegistration(true)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connect Now
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          )}

          {!loadingProfiles && featuredProfiles.length > 0 && (
            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-romantic hover:opacity-90 transition-all shadow-glow text-lg px-10 py-6 rounded-full font-['Poppins'] font-semibold hover:scale-105 transform"
              >
                View More Profiles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

      </div>
    </section>

      {/* Success Stories */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Heart className="w-4 h-4 text-primary fill-current animate-pulse" />
              <span className="text-sm font-['Poppins'] font-medium text-primary">Real Love Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold mb-4">Happily Ever Afters</h2>
            <p className="text-lg text-muted-foreground font-['Poppins']">
              Join thousands of couples who found their forever
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah & Michael",
                story: "We matched on our first day and haven't looked back since. MyShagun brought us together!",
                location: "New York",
                photo1: profileSarah,
                photo2: profileMichael,
              },
              {
                name: "Priya & Rahul",
                story: "The perfect blend of modern and traditional. Found my soulmate within weeks!",
                location: "Mumbai",
                photo1: profilePriya,
                photo2: profileRahul,
              },
              {
                name: "Emma & James",
                story: "Never believed in online matching until MyShagun. Now we're planning our dream wedding!",
                location: "London",
                photo1: profileEmma,
                photo2: profileJames,
              },
            ].map((story, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-[#8B4513]/10 hover:shadow-2xl hover:border-[#8B4513]/30 transition-all hover:-translate-y-2 duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-current drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 font-['Poppins'] italic leading-relaxed text-base">"{story.story}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <div className="relative">
                      <img
                        src={story.photo1}
                        alt={story.name.split(' & ')[0]}
                        className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-xl ring-2 ring-[#8B4513]/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="relative">
                      <img
                        src={story.photo2}
                        alt={story.name.split(' & ')[1]}
                        className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-xl ring-2 ring-[#8B4513]/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-['Playfair_Display'] font-bold text-foreground text-lg">{story.name}</p>
                    <p className="text-sm text-muted-foreground font-['Poppins'] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {story.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Happy Users Section */}
      <section className="py-20 sm:py-28 bg-card/30 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <img
            src={heroImage}
            alt="Happy Couple"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 rounded-full object-cover border-4 border-primary/20 shadow-lg"
          />
          <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-foreground mb-4">
            Join the millions who are already happy users
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 font-['Poppins']">
            Start your journey to find your perfect match today
          </p>
          <Button
            size="lg"
            onClick={() => setShowRegistration(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-full font-['Poppins'] font-semibold hover:scale-105 transform transition-all"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-pink-50/30 via-white to-rose-50/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-200/10 to-transparent"></div>

        {/* Romantic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <Heart
              key={`download-heart-${i}`}
              className="absolute text-pink-300/15 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
                animationDelay: `${i * 0.5}s`,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-romantic rounded-[3rem] p-8 sm:p-16 shadow-glow border border-primary/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                  <span className="text-sm font-['Poppins'] font-medium text-primary-foreground">Download Now</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold text-primary-foreground mb-4">
                  Find Love On The Go
                </h2>

                <p className="text-lg text-primary-foreground/90 mb-8 font-['Poppins']">
                  Download our mobile app and start your journey to finding your perfect match. Available on iOS and
                  Android.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-black/90 transition-all shadow-lg hover:scale-105 transform"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-['Poppins']">Download on the</div>
                      <div className="text-lg font-bold font-['Poppins']">App Store</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-black/90 transition-all shadow-lg hover:scale-105 transform"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs font-['Poppins']">Get it on</div>
                      <div className="text-lg font-bold font-['Poppins']">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-foreground/20 rounded-[2rem] blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-primary-foreground/10 to-transparent border-2 border-primary-foreground/30 rounded-[2rem] p-8 backdrop-blur-sm">
                    <Heart className="w-32 h-32 text-primary-foreground fill-current mx-auto animate-pulse" />
                    <p className="text-center text-primary-foreground font-['Poppins'] font-semibold mt-4">
                      Join the millions who are already happy users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <Button
          size="lg"
          onClick={() => setShowRegistration(true)}
          className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#6B3410] hover:to-[#8B4513] text-white rounded-full shadow-2xl px-6 py-6 font-['Poppins'] font-semibold flex items-center gap-2 animate-pulse hover:animate-none transition-all hover:scale-110"
        >
          <Heart className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">Register Free</span>
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
            Start Your Journey Today!
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationForm open={showRegistration} onClose={() => setShowRegistration(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
