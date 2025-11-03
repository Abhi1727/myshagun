

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import api from "@/lib/api";
import RegistrationForm from "@/components/RegistrationForm";
import { ArrowLeft } from "lucide-react";

type AuthMode = 'login' | 'otp' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showRegistration, setShowRegistration] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast({
        title: "Sign In Failed",
        description: error.response?.data?.errors?.[0]?.msg || 'Invalid email or password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      await api.post('/auth/send-otp', { email });
      setAuthMode('otp');
      toast({
        title: "OTP Sent!",
        description: "Check your email for the 6-digit code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.response?.data?.errors?.[0]?.msg || 'Failed to send OTP',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setAuthMode('reset-password');
      toast({
        title: "Reset Code Sent!",
        description: "Check your email for the password reset code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send Reset Code",
        description: error.response?.data?.errors?.[0]?.msg || 'Failed to send reset code',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast({
        title: "Password Reset Successful!",
        description: "You can now login with your new password.",
      });
      setAuthMode('login');
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.response?.data?.errors?.[0]?.msg || 'Failed to reset password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', data.token);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.response?.data?.errors[0]?.msg || 'OTP Verification Failed',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Mobile / User ID</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email, mobile or user ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs text-primary"
                  onClick={() => setAuthMode('forgot-password')}
                >
                  Forgot Password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keep-logged-in"
                checked={keepLoggedIn}
                onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
              />
              <label
                htmlFor="keep-logged-in"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? "Logging In..." : "Login Now"}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => setAuthMode('otp')}
            >
              Login With OTP
            </Button>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={otp ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            {!otp ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email-otp">Email Address</Label>
                  <Input
                    id="email-otp"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-4 text-center">
                  OTP sent to: <strong>{email}</strong>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp-input">Enter 6-Digit OTP</Label>
                  <Input
                    id="otp-input"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="link"
              className="w-full p-0 h-auto text-sm text-primary"
              onClick={() => {
                setAuthMode('login');
                setOtp("");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        );

      case 'forgot-password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Enter your email address and we'll send you a code to reset your password.
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-forgot">Email Address</Label>
              <Input
                id="email-forgot"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? "Sending Code..." : "Send Reset Code"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full p-0 h-auto text-sm text-primary"
              onClick={() => setAuthMode('login')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        );

      case 'reset-password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4 text-center">
              Reset code sent to: <strong>{email}</strong>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-otp">Reset Code</Label>
              <Input
                id="reset-otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full p-0 h-auto text-sm text-primary"
              onClick={() => {
                setAuthMode('login');
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login':
        return 'LOGIN';
      case 'otp':
        return otp ? 'VERIFY OTP' : 'LOGIN WITH OTP';
      case 'forgot-password':
        return 'FORGOT PASSWORD';
      case 'reset-password':
        return 'RESET PASSWORD';
      default:
        return 'LOGIN';
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case 'login':
        return 'And search your life partner';
      case 'otp':
        return 'Enter your email to receive OTP';
      case 'forgot-password':
        return 'Reset your account password';
      case 'reset-password':
        return 'Create a new password';
      default:
        return 'And search your life partner';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header Navigation */}
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
                onClick={() => navigate("/")}
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
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="font-['Poppins'] border-[#8B4513]/30 hover:bg-[#8B4513]/5 text-[#8B4513]"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full shadow-xl border-2 border-border/50">
            <Tabs defaultValue="signin" value="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="font-['Poppins'] font-semibold">Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setShowRegistration(true)} className="font-['Poppins'] font-semibold">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <CardHeader className="space-y-2 pb-4">
                  <CardTitle className="text-2xl sm:text-3xl text-center font-['Playfair_Display'] font-bold text-[#8B4513]">
                    {getTitle()}
                  </CardTitle>
                  <CardDescription className="text-center text-sm sm:text-base font-['Poppins']">
                    {getDescription()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="font-['Poppins']">
                  {renderForm()}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground font-['Poppins']">
              By continuing, you agree to our{" "}
              <button onClick={() => navigate("/terms-of-service")} className="text-[#8B4513] hover:underline font-medium">
                Terms of Service
              </button>{" "}
              and{" "}
              <button onClick={() => navigate("/privacy-policy")} className="text-[#8B4513] hover:underline font-medium">
                Privacy Policy
              </button>
            </p>
          </div>

          <RegistrationForm open={showRegistration} onClose={() => setShowRegistration(false)} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
