

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import api from "@/lib/api";
import RegistrationForm from "@/components/RegistrationForm";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth', { email, password });
      localStorage.setItem('token', data.token);
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

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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
      setOtpSent(true);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-romantic p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:mb-8">
          <img src={logo} alt="MyShagun Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-primary-foreground/20 shadow-lg" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">MyShagun</h1>
        </div>
        <Card className="w-full">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setShowRegistration(true)}>Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl text-center">LOGIN</CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  And search your life partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!otpSent ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                      {loading ? "Logging In..." : "Login Now"}
                    </Button>
                    <div className="text-center my-4">OR</div>
                    <Button type="button" className="w-full bg-green-600 hover:bg-green-700" onClick={handleSendOtp} disabled={loading || !email}>
                      {loading ? "Sending OTP..." : "Login With OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
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
                    <div className="text-center mt-4">
                      <Button variant="link" className="p-0 h-auto text-sm text-primary" onClick={() => {setOtpSent(false); setOtp("");}} type="button">
                        Back to Login
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl text-center">CREATE ACCOUNT</CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  Join MyShagun and find your perfect match
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">Start your journey with us</p>
                <Button onClick={() => setShowRegistration(true)} className="w-full bg-orange-500 hover:bg-orange-600">
                  Fill Registration Form
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        <RegistrationForm open={showRegistration} onClose={() => setShowRegistration(false)} />
      </div>
    </div>
  );
};

export default Auth;
