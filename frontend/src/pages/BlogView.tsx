import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  ArrowLeft, 
  BookOpen,
  Heart,
  MessageCircle,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { blogAPI } from '@/lib/api';
import { toast } from 'sonner';
import CommentSection from '@/components/CommentSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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
  metaTitle?: string;
  metaDescription?: string;
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
}

interface RelatedBlog {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  category: string;
  publishedAt: string;
  slug: string;
  readingTime: number;
}

export default function BlogView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBlogBySlug(slug);
      
      if (response.success) {
        setBlog(response.data);
        
        // Initialize like state from blog data
        setLikesCount(response.data.likeCount || 0);
        // Check if current user has liked (for now, we'll use a mock check)
        const userEmail = 'user@example.com'; // This should come from user authentication
        const userLiked = response.data.likes?.some(like => like.userEmail === userEmail) || false;
        setLiked(userLiked);
        
        // Fetch related blogs
        fetchRelatedBlogs(response.data.category, response.data._id);
      } else {
        throw new Error(response.message || 'Blog not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load blog';
      setError(errorMessage);
      handleError(error, {
        title: 'Failed to load blog',
        description: 'Unable to load the blog post. Please try again later.',
        duration: 6000
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string, excludeId: string) => {
    try {
      const response = await blogAPI.getPublishedBlogs({
        category,
        limit: 3
      });
      setRelatedBlogs(response.data.filter(blog => blog._id !== excludeId).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    const text = blog?.excerpt || '';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url
          });
          return;
        }
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      // For now, we'll use a mock email. In a real app, you'd get this from user context
      const userEmail = 'user@example.com'; // This should come from user authentication
      
      const response = await blogAPI.toggleBlogLike(blog._id, userEmail);
      
      // Update local state based on API response
      setLiked(response.data.liked);
      setLikesCount(response.data.likeCount);
      
      toast.success(response.message);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-6 text-xl text-gray-600 font-medium">Loading article...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-700 mb-4">Article not found</h1>
            <p className="text-gray-500 mb-8 text-lg">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/blog')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Articles
            </Button>
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
              Article Details
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {blog.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        </section>

        {/* Breadcrumb Navigation */}
        <section className="py-4 bg-white border-b border-border/50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                onClick={() => navigate('/blog')}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Articles
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-foreground font-medium">{blog.category}</span>
              <span className="text-gray-400">/</span>
              <span className="text-foreground font-medium truncate max-w-xs">{blog.title}</span>
            </nav>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <Badge className={`${getCategoryColor(blog.category)} border-2 px-4 py-2 text-sm font-semibold shadow-lg`}>
                        {blog.category}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-6 right-6 flex items-center space-x-3">
                      <Button
                        onClick={handleBookmark}
                        variant="ghost"
                        size="sm"
                        className="bg-white/95 hover:bg-white text-gray-700 rounded-full w-12 h-12 p-0 shadow-lg backdrop-blur-sm"
                      >
                        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current text-blue-600' : ''}`} />
                      </Button>
                      <Button
                        onClick={() => handleShare('native')}
                        variant="ghost"
                        size="sm"
                        className="bg-white/95 hover:bg-white text-gray-700 rounded-full w-12 h-12 p-0 shadow-lg backdrop-blur-sm"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-8 md:p-12">
                  {/* Author and Meta Information */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-14 w-14 border-3 border-gray-200 shadow-lg">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {getInitials(blog.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{blog.author}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(blog.publishedAt)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {blog.readingTime || 5} min read
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            {blog.views || 0} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Like Button */}
                    <Button
                      onClick={handleLike}
                      variant={liked ? "default" : "outline"}
                      size="lg"
                      className={`${liked ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'border-2 border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50'} rounded-full px-8 py-3 font-semibold`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                      {likesCount} {liked ? 'Liked' : 'Like'}
                    </Button>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex items-center gap-3 mb-10 p-4 bg-gray-50 rounded-xl">
                      <Tag className="h-5 w-5 text-gray-500" />
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-sm border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="mb-10" />

                  {/* Article Content */}
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-semibold prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-img:rounded-xl prose-img:shadow-lg prose-li:text-gray-700 prose-ul:space-y-2 prose-ol:space-y-2"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </article>

              {/* Social Sharing */}
              <Card className="mb-16 shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Share this article</h3>
                    <p className="text-gray-600 mb-6">Help others discover this valuable content</p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => handleShare('facebook')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Facebook className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={() => handleShare('twitter')}
                        className="bg-sky-500 hover:bg-sky-600 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Twitter className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={() => handleShare('linkedin')}
                        className="bg-blue-700 hover:bg-blue-800 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Linkedin className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="mb-16 shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Comments</h3>
                    <p className="text-gray-600">Join the conversation and share your thoughts</p>
                  </div>
                  <CommentSection 
                    blogId={blog._id} 
                    currentUserEmail="user@example.com" // Replace with actual user email from context
                  />
                </CardContent>
              </Card>

              {/* Related Articles */}
              {relatedBlogs.length > 0 && (
                <div className="mb-16">
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Related Articles</h2>
                    <p className="text-gray-600">Discover more insights and tutorials</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedBlogs.map((relatedBlog) => (
                      <Card key={relatedBlog._id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                        <div className="relative h-48 overflow-hidden">
                          {relatedBlog.featuredImage ? (
                            <img
                              src={relatedBlog.featuredImage}
                              alt={relatedBlog.title}
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
                            <Badge className={`${getCategoryColor(relatedBlog.category)} border-0 text-xs shadow-lg`}>
                              {relatedBlog.category}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg leading-tight">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {relatedBlog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span className="font-medium">{relatedBlog.author}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {relatedBlog.readingTime} min read
                            </span>
                          </div>
                          <Link to={`/blog/${relatedBlog.slug}`}>
                            <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold">
                              Read More
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}; 