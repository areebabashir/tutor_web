import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Users, Star, Sparkles, BookOpen, Loader2, Play, X, Eye } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCourses } from "@/hooks/useCourses";
import { useErrorHandler } from '@/hooks/useErrorHandler';

const coursesData = [
  {
    id: 1,
    title: "IELTS Preparation Course",
    category: "IELTS",
    description: "Comprehensive IELTS Academic & General Training prep: Listening, Reading, Writing, Speaking, full mock tests, band score strategies, and downloadable resources.",
    duration: "12 weeks",
    students: 3200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=400&h=240&fit=crop",
    price: "$149",
    level: "All Levels",
    instructor: "Expert IELTS Trainer"
  },
  {
    id: 2,
    title: "Spoken English Course",
    category: "Spoken English",
    description: "Master daily conversation, pronunciation, public speaking, and fluency with interactive audio, live speaking clubs, and downloadable lessons.",
    duration: "10 weeks",
    students: 2100,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=240&fit=crop",
    price: "$129",
    level: "All Levels",
    instructor: "Fluency Coach"
  },
  {
    id: 3,
    title: "Competitive Exams English Preparation",
    category: "Competitive Exams",
    description: "CSS, PMS, FPSC, PPSC, NTS English: grammar, vocabulary, comprehension, essay, precis, translation, past papers, and mock tests.",
    duration: "14 weeks",
    students: 1800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=240&fit=crop",
    price: "$139",
    level: "All Levels",
    instructor: "Exam Specialist"
  },
  {
    id: 4,
    title: "GRE Vocabulary Building Course",
    category: "GRE Vocabulary",
    description: "GRE Verbal mastery: 30+ word lists, flashcards, mnemonics, analogies, quizzes, and Urdu/Hindi translations for Pakistani learners.",
    duration: "8 weeks",
    students: 1200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=240&fit=crop",
    price: "$119",
    level: "All Levels",
    instructor: "GRE Verbal Coach"
  }
];

const categories = ["All", "IELTS", "English Proficiency", "Quran"];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { handleError } = useErrorHandler();

  // Fetch courses from API - show all courses
  const { courses, loading, error, pagination } = useCourses({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  // Handle error
  if (error) {
    handleError(error, {
      title: 'Failed to load courses',
      description: 'Unable to load course data. Please try again.'
    });
  }

    const filteredCourses = courses;

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
            <BookOpen className="w-4 h-4 mr-2" />
            {coursesData.length} Courses Available
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            English Exam & Language Preparation Courses
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Prepare for English exams and enhance your language skills with our comprehensive course offerings.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-white border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-12 h-12"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`btn-modern ${
                    selectedCategory === category 
                      ? "bg-gradient-to-r from-primary to-accent text-white" 
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Hand-picked by experts</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading courses: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card 
                  key={course._id} 
                  className="card-modern hover-lift overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.image}`}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop";
                      }}
                    />
                    <Link to={`/course/${course._id}`}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-primary/90 hover:text-white transition-colors z-10">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="badge-modern bg-gradient-to-r from-primary to-accent text-white">
                        {course.category}
                      </Badge>
                      <Badge variant="secondary" className="badge-modern">
                        {course.level}
                      </Badge>
                      {course.tags && course.tags.length > 0 && (
                        <Badge variant="outline" className="badge-modern bg-white/90 text-gray-800">
                          {course.tags[0]}
                        </Badge>
                      )}
                    </div>
                    {/* Remove duplicate category badge at top right */}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        by {course.instructorName}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.durationInDays ? `${course.durationInDays} days` : 'Flexible'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div>
                        <span className="text-3xl font-bold text-primary">
                          ${course.price}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">USD</span>
                      </div>
                      <div className="flex gap-2">
                        {/* Remove View Details button, keep only Enroll Now */}
                        <Link to={`/enroll-course?courseId=${course._id}`}>
                          <Button className="btn-modern bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg">
                            Enroll Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                            ))}
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="btn-modern bg-gradient-to-r from-primary to-accent text-white"
              >
                View All Courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-secondary/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their business communication skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="btn-modern bg-gradient-to-r from-primary to-accent text-white">
                Get Started Today
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="btn-modern">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;