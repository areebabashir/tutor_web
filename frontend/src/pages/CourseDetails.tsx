import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Star, CheckCircle, User, Calendar, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const courseData = {
  1: {
    title: "Complete Web Development Bootcamp",
    category: "Programming",
    description: "Master web development from scratch with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, and deploy real-world projects.",
    longDescription: "This intensive bootcamp covers everything you need to become a professional web developer. Starting with the fundamentals of HTML and CSS, you'll progress through JavaScript, modern frameworks like React, backend development with Node.js, and database management. By the end of this course, you'll have built multiple real-world projects and be ready for a career in web development.",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    price: "$99",
    tutor: {
      name: "Sarah Johnson",
      bio: "Senior Full-Stack Developer with 8+ years experience at top tech companies",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=100&h=100&fit=crop&crop=face"
    },
    syllabus: [
      "HTML5 & CSS3 Fundamentals",
      "JavaScript ES6+ Programming",
      "React & Component Development",
      "Node.js & Express Backend",
      "Database Design & MongoDB",
      "API Development & Integration",
      "Authentication & Security",
      "Deployment & DevOps",
      "Testing & Best Practices",
      "Portfolio Project Development"
    ],
    features: [
      "24/7 Support",
      "Lifetime Access",
      "Certificate of Completion",
      "Real-world Projects",
      "1-on-1 Mentorship",
      "Job Placement Assistance"
    ]
  }
  // Add more course data as needed
};

const CourseDetails = () => {
  const { id } = useParams();
  const course = courseData[parseInt(id || "1") as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-poppins font-bold mb-4">Course not found</h1>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">
                {course.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80 mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="gradient-secondary" className="text-lg px-8">
                  Enroll Now - {course.price}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Course */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins">About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.longDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Syllabus */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins">Course Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.syllabus.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins">Meet Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <img
                      src={course.tutor.image}
                      alt={course.tutor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-poppins font-semibold">{course.tutor.name}</h3>
                      <p className="text-muted-foreground">{course.tutor.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-poppins">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enroll Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div>
                      <span className="text-3xl font-poppins font-bold text-primary">
                        {course.price}
                      </span>
                      <span className="text-muted-foreground ml-2">one-time payment</span>
                    </div>
                    <Button className="w-full" variant="gradient" size="lg">
                      Enroll Now
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-poppins">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{course.students.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium">English</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access</span>
                    <span className="font-medium">Lifetime</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetails;