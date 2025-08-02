import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Clock, DollarSign, Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-illustration.jpg";

const categories = [
  { name: "Programming", icon: "💻", color: "bg-gradient-primary", count: "50+ courses" },
  { name: "Languages", icon: "🌍", color: "bg-gradient-secondary", count: "25+ courses" },
  { name: "Business", icon: "📊", color: "bg-gradient-primary", count: "40+ courses" },
  { name: "Design", icon: "🎨", color: "bg-gradient-secondary", count: "30+ courses" },
  { name: "Science", icon: "🔬", color: "bg-gradient-primary", count: "20+ courses" },
  { name: "Marketing", icon: "📈", color: "bg-gradient-secondary", count: "35+ courses" }
];

const featuredCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop",
    category: "Programming",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    price: "$99"
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    description: "Master SEO, social media marketing, and paid advertising",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=240&fit=crop",
    category: "Business",
    duration: "8 weeks",
    students: 1800,
    rating: 4.7,
    price: "$79"
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Create stunning user interfaces and user experiences",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=240&fit=crop",
    category: "Design",
    duration: "10 weeks",
    students: 1200,
    rating: 4.9,
    price: "$89"
  },
  {
    id: 4,
    title: "Data Science with Python",
    description: "Learn data analysis, machine learning, and visualization",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=240&fit=crop",
    category: "Programming",
    duration: "16 weeks",
    students: 3200,
    rating: 4.8,
    price: "$129"
  }
];

const whyChooseUs = [
  {
    icon: Users,
    title: "Expert Tutors",
    description: "Learn from industry professionals with real-world experience",
    color: "text-blue-500"
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Study at your own pace with 24/7 access to course materials",
    color: "text-orange-500"
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "High-quality education at prices that won't break the bank",
    color: "text-purple-500"
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Engage with hands-on projects and live interactive sessions",
    color: "text-yellow-500"
  }
];

const testimonials = [
  {
    name: "Sarah Wilson",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "EduVibe completely transformed my career. The web development course was comprehensive and the instructors were amazing!"
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The digital marketing course gave me the skills I needed to advance in my career. Highly recommend!"
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Excellent course structure and amazing support from the community. I learned so much in just a few weeks!"
  }
];

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6 animate-fade-in">
                Master Business English. 
                <span className="block text-gradient-secondary">Enliven Your Career.</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fade-in">
                Transform your professional communication with expert-led business English courses designed for global professionals and ambitious learners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start  animate-fade-in">
                <Link to="/courses">
                  <Button size="lg" variant="gradient" className="bg-gradient-to-r from-primary to-red-600 text-white text-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="gradient" 
                    className="bg-gradient-to-r from-primary to-red-600 text-white text-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <img
                src={heroImage}
                alt="Students learning online"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-secondary rounded-full animate-float opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-primary rounded-full animate-float-delayed opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Business English Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master essential business communication skills with expert-led courses designed for professional success
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link to="/courses" key={index}>
                <Card className="hover-lift shadow-soft text-center p-6 h-full border-0">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-poppins font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Featured Business English Courses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked courses from our most popular and highly-rated business English instructors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover-lift shadow-soft border-0 overflow-hidden">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-secondary">
                    {course.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-poppins font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-poppins font-bold text-primary">
                      {course.price}
                    </span>
                    <Link to={`/course/${course.id}`}>
                      <Button size="sm" variant="gradient">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" variant="outline">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Why Choose EduVibe?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best learning experience with features designed for your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover-lift shadow-soft border-0 p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              What Our Professionals Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our successful professionals who transformed their business communication
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-soft border-0 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <h4 className="font-poppins font-semibold">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-muted-foreground">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4">
            Ready to Enliven Your English? Let's Transform Your Career!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already elevated their business communication with our expert-led courses
          </p>
          <Link to="/contact">
            <Button size="lg" variant="gradient-secondary" className="text-lg px-8 py-4">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
