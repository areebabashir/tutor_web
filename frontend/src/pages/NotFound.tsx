import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, Users, FileText, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="404 - Page Not Found | Bizlish"
        description="The page you're looking for doesn't exist. Return to our homepage to explore our English learning courses, IELTS preparation, spoken English, and competitive exam resources."
        keywords="404, page not found, English learning, IELTS preparation, spoken English, competitive exams"
        noindex={true}
        nofollow={true}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-xl text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Let's Get You Back on Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                    <Home className="h-6 w-6" />
                    <span>Home</span>
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Courses</span>
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                    <Users className="h-6 w-6" />
                    <span>About Us</span>
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Contact</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Link to="/">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Return to Homepage
              </Link>
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>Need help? Contact us at <a href="mailto:bizlishofficial@gmail.com" className="text-primary hover:underline">bizlishofficial@gmail.com</a></p>
              <p>Or call us at <a href="tel:+923185078571" className="text-primary hover:underline">+92 318 5078571</a></p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
