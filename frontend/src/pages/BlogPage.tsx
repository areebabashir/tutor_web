import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, Search, Filter, Eye, ArrowRight, BookOpen, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { blogAPI } from '@/lib/api';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt: string;
  slug: string;
  readingTime: number;
  views: number;
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await blogAPI.getPublishedBlogs({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });
      setBlogs(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map((blog: Blog) => blog.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'Education': 'bg-green-100 text-green-800 border-green-200',
      'Lifestyle': 'bg-purple-100 text-purple-800 border-purple-200',
      'Business': 'bg-orange-100 text-orange-800 border-orange-200',
      'Health': 'bg-red-100 text-red-800 border-red-200',
      'Science': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading && blogs.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-6 text-xl text-gray-600 font-medium">Loading articles...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              {blogs.length} Articles Available
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Our Articles
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover insightful articles, tutorials, and stories from our expert writers
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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern pl-12 h-12"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={`btn-modern ${
                    selectedCategory === 'all' 
                      ? "bg-gradient-to-r from-primary to-accent text-white" 
                      : "hover:bg-muted"
                  }`}
                >
                  All Categories
                </Button>
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

        {/* Articles Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {blogs.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-700 mb-4">No articles found</h2>
                <p className="text-gray-500 mb-8 text-lg">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Check back soon for new articles'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {blogs.length} Article{blogs.length !== 1 ? 's' : ''} Found
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Latest insights and tutorials</span>
                    </div>
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogs.map((blog) => (
                    <Card key={blog._id} className="card-modern hover-lift overflow-hidden group">
                      {/* Featured Image */}
                      <div className="relative h-48 overflow-hidden">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className={`${getCategoryColor(blog.category)} border-0 text-xs`}>
                            {blog.category}
                          </Badge>
                        </div>

                        {/* Reading Time */}
                        <div className="absolute bottom-4 right-4">
                          <Badge className="bg-black/70 text-white border-0 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {blog.readingTime || 5} min
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Title */}
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg leading-tight">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                          {blog.excerpt}
                        </p>

                        {/* Author and Meta */}
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-8 w-8 border border-gray-200">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
                              {getInitials(blog.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{blog.author}</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(blog.publishedAt)}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {blog.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {blog.likeCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600">
                                #{tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                                +{blog.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Read More Button */}
                        <Link to={`/blog/${blog.slug}`}>
                          <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium">
                            Read Article
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="px-4 py-2"
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="px-4 py-2"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="px-4 py-2"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage; 