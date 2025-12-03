import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="MyShagun Logo" className="w-10 h-10 object-cover rounded-full border-2 border-primary/20" />
              <span className="text-2xl font-bold text-primary">MyShagun</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted partner in finding true love and building meaningful relationships.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/myshagun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/myshagun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our Instagram profile"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/myshagun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our Twitter profile"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/myshagun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="https://maps.google.com/?q=30+N+Gould+St,+Sheridan,+WY,+82801,+USA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  30 N Gould St, Sheridan, WY, 82801, USA
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:+18889277072"
                  className="hover:text-primary transition-colors"
                >
                  +1 (888) 927 7072
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:info@myshagun.us"
                  className="hover:text-primary transition-colors"
                >
                  info@myshagun.us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} MyShagun. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
