import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Users, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const coursesData = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    category: "Programming",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop",
    price: "$99"
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    category: "Business",
    description: "Master SEO, social media marketing, and paid advertising",
    duration: "8 weeks",
    students: 1800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=240&fit=crop",
    price: "$79"
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    description: "Create stunning user interfaces and user experiences",
    duration: "10 weeks",
    students: 1200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=240&fit=crop",
    price: "$89"
  },
  {
    id: 4,
    title: "Data Science with Python",
    category: "Programming",
    description: "Learn data analysis, machine learning, and visualization",
    duration: "16 weeks",
    students: 3200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=240&fit=crop",
    price: "$129"
  },
  {
    id: 5,
    title: "Spanish for Beginners",
    category: "Languages",
    description: "Master Spanish conversation, grammar, and culture",
    duration: "6 weeks",
    students: 950,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop",
    price: "$59"
  },
  {
    id: 6,
    title: "Financial Planning & Investment",
    category: "Business",
    description: "Learn personal finance, investing, and wealth building",
    duration: "8 weeks",
    students: 2100,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop",
    price: "$95"
  }
];

const categories = ["All", "Programming", "Business", "Design", "Languages", "Science"];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4 text-white">
            All Courses
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover our comprehensive collection of courses designed to advance your career and skills
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="hover-lift shadow-soft hover:shadow-primary transition-all duration-300 border-0 bg-card"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-secondary">
                    {course.category}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-poppins line-clamp-2">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-poppins font-bold text-primary">
                      {course.price}
                    </span>
                    <Link to={`/course/${course.id}`}>
                      <Button variant="gradient">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No courses found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;