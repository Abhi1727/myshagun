import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const TermsOfService = () => {
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-primary">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-foreground">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to MyShagun. By accessing or using our matrimonial platform, you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              These Terms constitute a legally binding agreement between you and MyShagun.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              To use MyShagun, you must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding contract</li>
              <li>Not be prohibited from using the service under applicable laws</li>
              <li>Be genuinely seeking a matrimonial relationship</li>
              <li>Not have been previously banned or suspended from our platform</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>3.1 Account Creation:</strong> You must provide accurate, current, and complete information
                during registration. You are responsible for maintaining the accuracy of your profile information.
              </p>
              <p>
                <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of
                your account credentials and for all activities that occur under your account. You must immediately
                notify us of any unauthorized access or security breach.
              </p>
              <p>
                <strong>3.3 Profile Verification:</strong> We reserve the right to verify the information you provide
                and may request additional documentation. Providing false information may result in account termination.
              </p>
              <p>
                <strong>3.4 One Account Per Person:</strong> You may only create and maintain one account. Multiple
                accounts created by the same person will be terminated.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct and Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Impersonate any person or entity or misrepresent your identity</li>
              <li>Post false, inaccurate, misleading, or fraudulent content</li>
              <li>Harass, abuse, threaten, or intimidate other users</li>
              <li>Use the service for commercial purposes without authorization</li>
              <li>Spam, solicit money from, or defraud other users</li>
              <li>Upload inappropriate, offensive, or adult content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems (bots, scrapers) to access the service</li>
              <li>Collect or harvest personal information of other users</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>5.1 Your Content:</strong> You retain ownership of the content you post on MyShagun,
                including photos, text, and personal information. However, by posting content, you grant us a
                non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
                on our platform.
              </p>
              <p>
                <strong>5.2 Content Responsibility:</strong> You are solely responsible for the content you post.
                We do not endorse or guarantee the accuracy of user-generated content.
              </p>
              <p>
                <strong>5.3 Content Moderation:</strong> We reserve the right to remove any content that violates
                these Terms or is deemed inappropriate, without prior notice.
              </p>
              <p>
                <strong>5.4 Copyright:</strong> You must own or have rights to all content you upload. We respect
                intellectual property rights and will respond to valid copyright infringement claims.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your personal information. By using MyShagun,
              you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          {/* Payments and Subscriptions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payments and Subscriptions</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>7.1 Subscription Plans:</strong> MyShagun may offer various subscription plans with different
                features and pricing. Plan details and pricing are subject to change with notice.
              </p>
              <p>
                <strong>7.2 Payment Processing:</strong> All payments are processed securely through third-party
                payment processors. We do not store your complete payment information.
              </p>
              <p>
                <strong>7.3 Refund Policy:</strong> Refunds are handled on a case-by-case basis. Please contact
                our support team for refund requests. We reserve the right to deny refunds for services already rendered.
              </p>
              <p>
                <strong>7.4 Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the
                renewal date. You can manage your subscription settings in your account.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Account Termination</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>8.1 Termination by You:</strong> You may delete your account at any time through your
                account settings. Upon deletion, your profile will be removed from public view.
              </p>
              <p>
                <strong>8.2 Termination by Us:</strong> We reserve the right to suspend or terminate your account
                at any time for violations of these Terms, suspicious activity, or any other reason, with or without notice.
              </p>
              <p>
                <strong>8.3 Effect of Termination:</strong> Upon termination, you lose access to all features and
                content associated with your account. We may retain certain information as required by law or
                for legitimate business purposes.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>9.1 No Guarantees:</strong> MyShagun does not guarantee that you will find a match or
                enter into a matrimonial relationship. Success depends on many factors beyond our control.
              </p>
              <p>
                <strong>9.2 User Verification:</strong> While we verify profiles, we cannot guarantee the accuracy
                of all user information. You are responsible for conducting your own due diligence.
              </p>
              <p>
                <strong>9.3 Service Availability:</strong> We strive to provide uninterrupted service but do not
                guarantee that the platform will always be available or error-free.
              </p>
              <p>
                <strong>9.4 Third-Party Content:</strong> We are not responsible for content, products, or services
                provided by third parties linked from our platform.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, MyShagun shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including loss of profits, data, or other intangible losses,
              resulting from your use of or inability to use the service. Our total liability shall not exceed the
              amount you paid us in the twelve months prior to the event giving rise to the liability.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless MyShagun, its officers, directors, employees, and
              agents from any claims, liabilities, damages, losses, and expenses arising from your violation of
              these Terms, your use of the service, or your violation of any rights of another party.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of significant changes
              via email or through the platform. Your continued use of MyShagun after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law and Dispute Resolution</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong>13.1 Governing Law:</strong> These Terms are governed by the laws of the State of Wyoming,
                United States, without regard to conflict of law principles.
              </p>
              <p>
                <strong>13.2 Dispute Resolution:</strong> Any disputes arising from these Terms or your use of
                MyShagun shall first be resolved through good faith negotiations. If negotiations fail, disputes
                shall be resolved through binding arbitration in accordance with the rules of the American
                Arbitration Association.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg space-y-2">
              <p className="text-foreground"><strong>Email:</strong> info@myshaagun.com</p>
              <p className="text-foreground"><strong>Phone:</strong> +1 (888) 927 7072</p>
              <p className="text-foreground"><strong>Address:</strong> 30 N Gould St, Sheridan, WY, 82801, USA</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-8 mt-8">
            <p className="text-muted-foreground leading-relaxed">
              By using MyShagun, you acknowledge that you have read, understood, and agree to be bound by
              these Terms of Service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService;
