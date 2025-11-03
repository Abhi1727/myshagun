import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Users, Shield, Sparkles, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-primary">About MyShagun</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in finding true love and building meaningful relationships
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto text-muted-foreground space-y-4 leading-relaxed">
            <p>
              MyShagun was born from a simple belief: everyone deserves to find their perfect life partner.
              In today's fast-paced world, finding meaningful connections can be challenging, especially when
              it comes to finding someone who shares your values, culture, and life goals.
            </p>
            <p>
              We created MyShagun to bridge this gap - a modern matrimonial platform that combines traditional
              values with cutting-edge technology. Our platform is designed to help you connect with compatible
              individuals who are also seeking genuine, long-term relationships.
            </p>
            <p>
              What sets us apart is our commitment to authenticity, safety, and meaningful connections. We verify
              every profile, protect your privacy, and use intelligent matching algorithms to help you find your
              perfect match.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16 bg-muted/30 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
            To create a safe, trusted, and innovative platform that brings people together to form
            lasting relationships built on mutual respect, understanding, and shared values.
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-muted-foreground">
                We believe in genuine connections. Every profile is verified to ensure you're connecting
                with real people who are serious about finding their life partner.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy & Security</h3>
              <p className="text-muted-foreground">
                Your privacy is our top priority. We employ industry-leading security measures to protect
                your personal information and give you control over who sees your profile.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p className="text-muted-foreground">
                We celebrate diversity and welcome people from all backgrounds, cultures, and walks of life.
                Love knows no boundaries, and neither do we.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate to improve your experience. Our smart matching algorithms and
                user-friendly features make finding your perfect match easier than ever.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Purpose-Driven</h3>
              <p className="text-muted-foreground">
                We're not just another dating app. We're focused on helping people find meaningful,
                long-term relationships that lead to marriage and lifelong partnerships.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do - from our customer service to our platform
                features, ensuring you have the best possible experience.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Choose MyShagun?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Verified Profiles</h3>
                  <p className="text-muted-foreground">
                    Every profile goes through our verification process to ensure authenticity and safety.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Smart Matching</h3>
                  <p className="text-muted-foreground">
                    Our advanced algorithms match you with compatible profiles based on your preferences.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Privacy Controls</h3>
                  <p className="text-muted-foreground">
                    You decide who can see your profile and contact you with granular privacy settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is always here to help you with any questions or concerns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Success Stories</h3>
                  <p className="text-muted-foreground">
                    Thousands of couples have found their perfect match through MyShagun.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Mobile Friendly</h3>
                  <p className="text-muted-foreground">
                    Access MyShagun anytime, anywhere with our responsive web and mobile applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/10 to-primary/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of people who have found their life partners through MyShagun.
            Your perfect match is waiting!
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Get Started Today
              <Heart className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
