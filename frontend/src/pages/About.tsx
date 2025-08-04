import { Users, Target, Heart, Award, BookOpen, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Full-Stack Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=300&h=300&fit=crop&crop=face",
    bio: "8+ years experience at top tech companies"
  },
  {
    name: "Michael Chen",
    role: "Data Science Expert",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "PhD in Machine Learning, former Google AI researcher"
  },
  {
    name: "Emily Rodriguez",
    role: "UX/UI Design Lead",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Award-winning designer with 10+ years experience"
  },
  {
    name: "David Thompson",
    role: "Business Strategy",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former McKinsey consultant and startup founder"
  },
  {
    name: "Lisa Wang",
    role: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
    bio: "Growth hacker who scaled multiple companies to millions"
  },
  {
    name: "James Wilson",
    role: "Language Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Polyglot speaking 6 languages, certified language instructor"
  }
];

const stats = [
  { icon: Users, number: "50,000+", label: "Happy Students" },
  { icon: BookOpen, number: "200+", label: "Expert Courses" },
  { icon: Globe, number: "150+", label: "Countries Reached" },
  { icon: Award, number: "95%", label: "Success Rate" }
];

const values = [
  {
    icon: Target,
    title: "Expert Tutors",
    description: "Learn from industry professionals with real-world experience and proven expertise in their fields."
  },
  {
    icon: Heart,
    title: "Flexible Schedule",
    description: "Study at your own pace with our flexible learning platform designed to fit your busy lifestyle."
  },
  {
    icon: Award,
    title: "Affordable Pricing",
    description: "High-quality education shouldn't break the bank. We offer competitive pricing with maximum value."
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Engage with interactive content, hands-on projects, and live sessions for an immersive experience."
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            About Our Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Who We Are
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're passionate educators and industry experts dedicated to making high-quality learning accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-poppins font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-poppins font-semibold text-primary mb-3">
                    Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize education by providing accessible, high-quality learning experiences that empower individuals to achieve their personal and professional goals, regardless of their background or location.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-poppins font-semibold text-primary mb-3">
                    Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the world's leading platform for skill-based learning, creating a global community where knowledge flows freely and everyone has the opportunity to unlock their full potential.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-soft w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in creating an exceptional learning experience that combines expertise, flexibility, and innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-lift shadow-soft">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-poppins">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Meet Our Expert Tutors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our instructors are industry professionals and subject matter experts passionate about sharing their knowledge and helping you succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover-lift shadow-soft">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-poppins font-semibold mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;