import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface RegistrationFormProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationForm = ({ open, onClose }: RegistrationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    interestedIn: "",
    interestedFor: "",
    firstName: "",
    lastName: "",
    dateOfBirth: undefined as Date | undefined,
    religion: "",
    email: "",
    password: "",
    mobileNumber: "",
    city: "",
    state: "",
    livesWithFamily: "",
    maritalStatus: "",
    height: "",
    diet: "",
    smoking: "",
    drinking: "",
    highestQualification: "",
    profession: "",
  });

  const totalSteps = 4; // Reduced to 4 steps as photo upload is removed
  const progress = (step / totalSteps) * 100;

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth?.toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors[0].msg || 'Failed to create profile.');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);

      toast({
        title: "Success!",
        description: "Your profile has been created successfully.",
      });

      onClose();
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
            <img
              src={logo}
              alt="MyShagun Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-primary/20"
            />
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center sm:text-left">
              Create Your Profile
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-muted-foreground">
            Fill in the details to create your profile and start your journey with us.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 sm:mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Information</h3>

            <div className="space-y-2">
              <Label htmlFor="interestedIn" className="text-sm">
                Interested In <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.interestedIn}
                onValueChange={(value) => updateField("interestedIn", value)}
                required
              >
                <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestedFor" className="text-sm">
                Interested For <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.interestedFor}
                onValueChange={(value) => updateField("interestedFor", value)}
                required
              >
                <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dating">Dating</SelectItem>
                  <SelectItem value="relationship">Relationship</SelectItem>
                  <SelectItem value="marriage">Marriage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth (YYYY-MM-DD) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  updateField("dateOfBirth", date);
                }}
                min="1950-01-01"
                max={format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd")}
                className="h-10 sm:h-auto text-sm sm:text-base"
                required
              />
              <p className="text-xs text-muted-foreground">You must be at least 18 years old to register</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your@email.com"
                className="text-sm sm:text-base h-10 sm:h-auto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Enter your password"
                className="text-sm sm:text-base h-10 sm:h-auto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-sm">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => updateField("mobileNumber", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="text-sm sm:text-base h-10 sm:h-auto"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Location & Community</h3>

            <div className="space-y-2">
              <Label htmlFor="religion" className="text-sm">
                Religion <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.religion} onValueChange={(value) => updateField("religion", value)} required>
                <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Enter city"
                  className="text-sm sm:text-base h-10 sm:h-auto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="Enter state"
                  className="text-sm sm:text-base h-10 sm:h-auto"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                Lives With Family? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.livesWithFamily}
                onValueChange={(value) => updateField("livesWithFamily", value)}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="font-normal text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="font-normal text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="maritalStatus" className="text-sm">
                  Marital Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(value) => updateField("maritalStatus", value)}
                  required
                >
                  <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never-married">Never Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm">
                  Height <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.height} onValueChange={(value) => updateField("height", value)} required>
                  <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="4'0">4'0"</SelectItem>
                    <SelectItem value="4'1">4'1"</SelectItem>
                    <SelectItem value="4'2">4'2"</SelectItem>
                    <SelectItem value="4'3">4'3"</SelectItem>
                    <SelectItem value="4'4">4'4"</SelectItem>
                    <SelectItem value="4'5">4'5"</SelectItem>
                    <SelectItem value="4'6">4'6"</SelectItem>
                    <SelectItem value="4'7">4'7"</SelectItem>
                    <SelectItem value="4'8">4'8"</SelectItem>
                    <SelectItem value="4'9">4'9"</SelectItem>
                    <SelectItem value="4'10">4'10"</SelectItem>
                    <SelectItem value="4'11">4'11"</SelectItem>
                    <SelectItem value="5'0">5'0"</SelectItem>
                    <SelectItem value="5'1">5'1"</SelectItem>
                    <SelectItem value="5'2">5'2"</SelectItem>
                    <SelectItem value="5'3">5'3"</SelectItem>
                    <SelectItem value="5'4">5'4"</SelectItem>
                    <SelectItem value="5'5">5'5"</SelectItem>
                    <SelectItem value="5'6">5'6"</SelectItem>
                    <SelectItem value="5'7">5'7"</SelectItem>
                    <SelectItem value="5'8">5'8"</SelectItem>
                    <SelectItem value="5'9">5'9"</SelectItem>
                    <SelectItem value="5'10">5'10"</SelectItem>
                    <SelectItem value="5'11">5'11"</SelectItem>
                    <SelectItem value="6'0">6'0"</SelectItem>
                    <SelectItem value="6'1">6'1"</SelectItem>
                    <SelectItem value="6'2">6'2"</SelectItem>
                    <SelectItem value="6'3">6'3"</SelectItem>
                    <SelectItem value="6'4">6'4"</SelectItem>
                    <SelectItem value="6'5">6'5"</SelectItem>
                    <SelectItem value="6'6">6'6"</SelectItem>
                    <SelectItem value="6'7">6'7"</SelectItem>
                    <SelectItem value="6'8">6'8"</SelectItem>
                    <SelectItem value="6'9">6'9"</SelectItem>
                    <SelectItem value="6'10">6'10"</SelectItem>
                    <SelectItem value="6'11">6'11"</SelectItem>
                    <SelectItem value="7'0">7'0"</SelectItem>
                    <SelectItem value="7'1">7'1"</SelectItem>
                    <SelectItem value="7'2">7'2"</SelectItem>
                    <SelectItem value="7'3">7'3"</SelectItem>
                    <SelectItem value="7'4">7'4"</SelectItem>
                    <SelectItem value="7'5">7'5"</SelectItem>
                    <SelectItem value="7'6">7'6"</SelectItem>
                    <SelectItem value="7'7">7'7"</SelectItem>
                    <SelectItem value="7'8">7'8"</SelectItem>
                    <SelectItem value="7'9">7'9"</SelectItem>
                    <SelectItem value="7'10">7'10"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet" className="text-sm">
                Diet <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.diet} onValueChange={(value) => updateField("diet", value)} required>
                <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue placeholder="Select diet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="smoking" className="text-sm">
                  Smoking <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.smoking} onValueChange={(value) => updateField("smoking", value)} required>
                  <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                    <SelectValue placeholder="Select smoking preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drinking" className="text-sm">
                  Drinking <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.drinking} onValueChange={(value) => updateField("drinking", value)} required>
                  <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                    <SelectValue placeholder="Select drinking preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Education & Profession</h3>

            <div className="space-y-2">
              <Label htmlFor="highestQualification" className="text-sm">
                Highest Qualification <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.highestQualification}
                onValueChange={(value) => updateField("highestQualification", value)}
                required
              >
                <SelectTrigger className="h-10 sm:h-auto text-sm sm:text-base">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD/Doctorate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm">
                Profession <span className="text-destructive">*</span>
              </Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => updateField("profession", e.target.value)}
                placeholder="Enter your profession"
                className="text-sm sm:text-base h-10 sm:h-auto"
                required
              />
            </div>
            <div className="flex justify-center pt-4">
                <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">Submit</Button>
            </div>
          </div>
        )}

        {step < totalSteps && (
          <div className="flex justify-between mt-6 sm:mt-8 gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4"
            >
              Previous
            </Button>
            <Button onClick={nextStep} className="text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4">
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;