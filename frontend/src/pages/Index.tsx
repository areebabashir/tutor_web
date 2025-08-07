import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Clock, DollarSign, Star, Play, ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-illustration.jpg";
import { useCourses } from "@/hooks/useCourses";
import { reviewAPI, blogAPI } from "@/lib/api";
import { toast } from "sonner";

const categories = [
  { name: "Programming", icon: "💻", color: "bg-gradient-primary", count: "50+ courses" },
  { name: "Languages", icon: "🌍", color: "bg-gradient-secondary", count: "25+ courses" },
  { name: "Business", icon: "📊", color: "bg-gradient-primary", count: "40+ courses" },
  { name: "Design", icon: "🎨", color: "bg-gradient-secondary", count: "30+ courses" },
  { name: "Science", icon: "🔬", color: "bg-gradient-primary", count: "20+ courses" },
  { name: "Marketing", icon: "📈", color: "bg-gradient-secondary", count: "35+ courses" }
];

interface Review {
  _id: string;
  name: string;
  image?: string;
  review: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  featuredImage: string;
  views: number;
  readingTime: number;
  featured: boolean;
  allowComments: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
}

const featuredCourses = [
  {
    id: 1,
    title: "IELTS Preparation Course",
    description: "Comprehensive IELTS Academic & General Training prep: Listening, Reading, Writing, Speaking, full mock tests, band score strategies, and downloadable resources.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=400&h=240&fit=crop",
    category: "IELTS",
    duration: "12 weeks",
    students: 3200,
    rating: 4.9,
    price: "$149"
  },
  {
    id: 2,
    title: "Spoken English Course",
    description: "Master daily conversation, pronunciation, public speaking, and fluency with interactive audio, live speaking clubs, and downloadable lessons.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=240&fit=crop",
    category: "Spoken English",
    duration: "10 weeks",
    students: 2100,
    rating: 4.8,
    price: "$129"
  },
  {
    id: 3,
    title: "Competitive Exams English Preparation",
    description: "CSS, PMS, FPSC, PPSC, NTS English: grammar, vocabulary, comprehension, essay, precis, translation, past papers, and mock tests.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=240&fit=crop",
    category: "Competitive Exams",
    duration: "14 weeks",
    students: 1800,
    rating: 4.7,
    price: "$139"
  },
  {
    id: 4,
    title: "GRE Vocabulary Building Course",
    description: "GRE Verbal mastery: 30+ word lists, flashcards, mnemonics, analogies, quizzes, and Urdu/Hindi translations for Pakistani learners.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=240&fit=crop",
    category: "GRE Vocabulary",
    duration: "8 weeks",
    students: 1200,
    rating: 4.8,
    price: "$119"
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
    text: "Bizlish completely transformed my career. The web development course was comprehensive and the instructors were amazing!"
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  
  // Fetch featured courses from API - show only 3 on front page
  const { courses: featuredCourses, loading: coursesLoading, error: coursesError } = useCourses({
    limit: 3
  });

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewAPI.getPublicReviews({ limit: 10 });
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Fetch featured blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const response = await blogAPI.getPublishedBlogs({ limit: 3 });
        setBlogs(response.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
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
              Popular Business English Courses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular and highly-rated business English courses. Start your learning journey today!
            </p>
          </div>
          
          {coursesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading courses...</span>
            </div>
          ) : coursesError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading courses: {coursesError}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.length > 0 ? (
                featuredCourses.slice(0, 3).map((course) => (
                <Card key={course._id} className="hover-lift shadow-soft border-0 overflow-hidden">
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.image}`}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=400&h=240&fit=crop";
                      }}
                    />
                    <Link to={`/course/${course._id}`}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-primary/90 hover:text-white transition-colors z-10">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-gradient-secondary">
                        {course.category}
                      </Badge>
                      {course.tags && course.tags.length > 0 && (
                        <Badge variant="outline" className="bg-white/90 text-gray-800 text-xs">
                          {course.tags[0]}
                        </Badge>
                      )}
                    </div>
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
                        <span>{course.durationInDays ? `${course.durationInDays} days` : 'Flexible'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-poppins font-bold text-primary">
                        ${course.price}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/enroll-course?courseId=${course._id}`}>
                          <Button size="sm" variant="gradient">
                            Enroll Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No courses available at the moment</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" variant="gradient" className="px-8">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Explore {featuredCourses.length} featured courses and more in our complete catalog
            </p>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Latest Insights & Tips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover valuable insights, tips, and strategies to enhance your business English skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="card-modern hover-lift">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="bg-muted h-48 rounded-lg mb-4"></div>
                      <div className="space-y-3">
                        <div className="bg-muted h-4 rounded w-3/4"></div>
                        <div className="bg-muted h-4 rounded w-1/2"></div>
                        <div className="bg-muted h-4 rounded w-5/6"></div>
                </div>
              </div>
              </CardContent>
            </Card>
              ))
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card key={blog._id} className="card-modern hover-lift">
                  <CardContent className="p-6">
                    <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={blog.featuredImage 
                          ? (blog.featuredImage.startsWith('data:') || blog.featuredImage.startsWith('http://') || blog.featuredImage.startsWith('https://'))
                            ? blog.featuredImage 
                            : blog.featuredImage.startsWith('/')
                              ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${blog.featuredImage}`
                              : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/images/${blog.featuredImage}`
                          : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop";
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {blog.category}
                  </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(blog.createdAt)}
                        </span>
                </div>
                      
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {blog.readingTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {blog.views} views
                          </span>
                </div>
                        <Link to={`/blog/${blog.slug}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Read More
                            <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
                      </div>
                    </div>
              </CardContent>
            </Card>
              ))
            ) : (
              // No blogs available
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No blog posts available at the moment.</p>
                  <p className="text-sm">Check back soon for new insights!</p>
                </div>
              </div>
            )}
          </div>
          
          {blogs.length > 0 && (
            <div className="text-center mt-8">
            <Link to="/blog">
                <Button variant="outline" size="lg" className="btn-modern">
                  View All Blog Posts
                  <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              Why Choose Bizlish?
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
            {reviewsLoading ? (
              <Card className="shadow-soft border-0 p-8">
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading reviews...</span>
                </div>
              </Card>
            ) : reviews.length > 0 ? (
            <Card className="shadow-soft border-0 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                    src={reviews[currentTestimonial]?.image 
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${reviews[currentTestimonial].image}`
                      : "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=100&h=100&fit=crop&crop=face"
                    }
                    alt={reviews[currentTestimonial]?.name || "Reviewer"}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                      {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4 italic">
                      "{reviews[currentTestimonial]?.review || "No review text available"}"
                  </p>
                  <div>
                    <h4 className="font-poppins font-semibold">
                        {reviews[currentTestimonial]?.name || "Anonymous"}
                    </h4>
                    <p className="text-muted-foreground">
                        Professional
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
                    disabled={reviews.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                    {reviews.map((_, index) => (
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
                    disabled={reviews.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
            ) : (
              <Card className="shadow-soft border-0 p-8">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews available at the moment.</p>
                </div>
              </Card>
            )}
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
