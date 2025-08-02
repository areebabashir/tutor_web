import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import bizlishLogo from "@/assets/bzlish.jpg";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={bizlishLogo} 
                alt="BIZLISH Logo" 
                className="h-12 w-auto rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xl font-poppins font-bold text-primary">
                  BIZLISH
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Enliven English
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground">
              Empowering professionals worldwide with business English skills that elevate your career and communication.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/courses" className="block text-muted-foreground hover:text-primary transition-colors">
                Courses
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@bizlish.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Twitter className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Youtube className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 BIZLISH. All rights reserved. Enlivening English for professionals worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;