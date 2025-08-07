import { useState } from "react";
import { Users, Award, Globe, Clock, Star, CheckCircle, Sparkles, BookOpen, Target, Heart, Shield, Zap, TrendingUp, Lightbulb, Rocket, GraduationCap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Full-Stack Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=300&h=300&fit=crop&crop=face",
    bio: "8+ years experience at top tech companies",
    expertise: ["React", "Node.js", "Python"],
    rating: 4.9,
    students: 1200
  },
  {
    name: "Michael Chen",
    role: "Data Science Expert",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "PhD in Machine Learning, former Google AI researcher",
    expertise: ["Machine Learning", "Python", "TensorFlow"],
    rating: 4.8,
    students: 950
  },
  {
    name: "Emily Rodriguez",
    role: "UX/UI Design Lead",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Award-winning designer with 10+ years experience",
    expertise: ["Figma", "Adobe Creative Suite", "Prototyping"],
    rating: 4.9,
    students: 800
  },
  {
    name: "David Thompson",
    role: "Business Strategy",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former McKinsey consultant and startup founder",
    expertise: ["Strategy", "Business Development", "Analytics"],
    rating: 4.7,
    students: 650
  },
  {
    name: "Lisa Wang",
    role: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
    bio: "Growth hacker who scaled multiple companies to millions",
    expertise: ["SEO", "Social Media", "Growth Hacking"],
    rating: 4.8,
    students: 1100
  },
  {
    name: "James Wilson",
    role: "Language Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Polyglot speaking 6 languages, certified language instructor",
    expertise: ["English", "Spanish", "French"],
    rating: 4.9,
    students: 1400
  }
];

const stats = [
  { icon: Users, number: "50,000+", label: "Happy Students", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: BookOpen, number: "200+", label: "Expert Courses", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Globe, number: "150+", label: "Countries Reached", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Award, number: "95%", label: "Success Rate", color: "text-primary", bgColor: "bg-primary/10" }
];

const values = [
  {
    icon: Target,
    title: "Expert Tutors",
    description: "Learn from industry professionals with real-world experience and proven expertise in their fields.",
    color: "from-primary to-accent",
    bgColor: "bg-primary/5"
  },
  {
    icon: Heart,
    title: "Flexible Schedule",
    description: "Study at your own pace with our flexible learning platform designed to fit your busy lifestyle.",
    color: "from-primary to-accent",
    bgColor: "bg-primary/5"
  },
  {
    icon: Award,
    title: "Affordable Pricing",
    description: "High-quality education shouldn't break the bank. We offer competitive pricing with maximum value.",
    color: "from-primary to-accent",
    bgColor: "bg-primary/5"
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Engage with interactive content, hands-on projects, and live sessions for an immersive experience.",
    color: "from-primary to-accent",
    bgColor: "bg-primary/5"
  }
];

const achievements = [
  {
    icon: Star,
    title: "Industry Recognition",
    description: "Awarded 'Best Online Learning Platform 2024' by Education Excellence Awards",
    year: "2024"
  },
  {
    icon: TrendingUp,
    title: "Rapid Growth",
    description: "Reached 50,000+ students across 150+ countries in just 3 years",
    year: "2023"
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "ISO 9001:2015 certified for quality management in education",
    year: "2023"
  },
  {
    icon: Lightbulb,
    title: "Innovation Award",
    description: "Recognized for innovative AI-powered learning technology",
    year: "2022"
  }
];

const About = () => {
  const { handleError } = useErrorHandler();

  // Handle any potential errors in the component
  const handleComponentError = (error: any, context: string) => {
    handleError(error, {
      title: `Error in ${context}`,
      description: `Something went wrong while loading ${context}. Please try refreshing the page.`,
      duration: 6000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
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
            We specialize in English language and exam preparation: IELTS, Spoken English, Competitive Exams, and GRE Vocabulary. Our platform offers interactive quizzes, downloadable resources, live speaking clubs, and expert guidance for your success.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center stagger-item animate-fade-in-up">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To empower learners in Pakistan and beyond to achieve their English language and exam goals through comprehensive, interactive, and accessible online courses.
                  </p>
                </div>
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To become the world's leading platform for skill-based learning, creating a global community where knowledge flows freely and everyone has the opportunity to unlock their full potential.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating an exceptional learning experience that combines expertise, flexibility, and innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className={`${value.bgColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognition and milestones that showcase our commitment to educational excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {achievement.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {achievement.year}
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Tutors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our instructors are industry professionals and subject matter experts passionate about sharing their knowledge and helping you succeed.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <Carousel opts={{ align: "start" }}>
              <CarouselPrevious />
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3 px-2">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-gray-200">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-accent rounded-full p-1">
                            <GraduationCap className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 text-sm mb-4">
                          {member.bio}
                        </p>
                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        {/* Stats */}
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-primary fill-current" />
                            <span className="font-medium">{member.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-medium">{member.students}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already transformed their careers with our expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Explore Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;