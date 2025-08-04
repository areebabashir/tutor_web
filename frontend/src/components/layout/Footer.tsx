import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Sparkles, ArrowUp } from "lucide-react";
import bizlishLogo from "@/assets/bzlish.jpg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-secondary/50 to-background border-t border-border/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(15,59,106,0.03)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={bizlishLogo} 
                  alt="BIZLISH Logo" 
                  className="w-auto rounded-xl transition-all duration-300 group-hover:scale-105"
                  style={{width: "80px", height: "80px"}}
                />
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  BIZLISH
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Enliven English
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Empowering professionals worldwide with business English skills that elevate your career and communication to new heights.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Trusted by 5000+ professionals</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-foreground">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Home</span>
              </Link>
              <Link to="/courses" className="block text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Courses</span>
              </Link>
              <Link to="/quizzes" className="block text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Quizzes</span>
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">About Us</span>
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Contact</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-foreground">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">info@bizlish.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-foreground">Follow Us</h3>
            <p className="text-muted-foreground text-sm">
              Stay connected with us for the latest updates and insights.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg">
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
            <div className="pt-4">
              <button 
                onClick={scrollToTop}
                className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg group"
              >
                <ArrowUp className="h-5 w-5 text-white group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-center md:text-left">
              © 2024 BIZLISH. All rights reserved. Enlivening English for professionals worldwide.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;