import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Eye, FileText, Calendar, Eye as EyeIcon, Users, TrendingUp, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { blogAPI } from "@/lib/api";
import BlogEditor from "@/components/BlogEditor";

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
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { getAuthHeaders } = useAdminAuth();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "IELTS preparation",
    tags: "",
    author: "Admin",
    status: "draft",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    featured: false,
    allowComments: true
  });

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [categoryFilter, statusFilter, searchQuery]);

  const fetchBlogs = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const params: any = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      
      const data = await blogAPI.getAllBlogs(Authorization, params);
      setBlogs(data.data || []);
    } catch (error) {
      console.error('Fetch blogs error:', error);
      toast.error('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const data = await blogAPI.getBlogStats(Authorization);
      setStats(data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleCreateBlog = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Blog title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Blog content is required');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Blog excerpt is required');
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      await blogAPI.createBlog(formData, Authorization);

      toast.success('Blog created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Create blog error:', error);
      toast.error('Failed to create blog');
    }
  };

  const handleUpdateBlog = async () => {
    if (!selectedBlog) return;

    // Validation
    if (!formData.title.trim()) {
      toast.error('Blog title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Blog content is required');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Blog excerpt is required');
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      await blogAPI.updateBlog(selectedBlog._id, formData, Authorization);

      toast.success('Blog updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Update blog error:', error);
      toast.error('Failed to update blog');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await blogAPI.deleteBlog(blogId, Authorization);
      toast.success('Blog deleted successfully');
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Delete blog error:', error);
      toast.error('Failed to delete blog');
    }
  };

  const openEditDialog = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags.join(', '),
      author: blog.author,
      status: blog.status,
      featuredImage: blog.featuredImage,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      featured: blog.featured,
      allowComments: blog.allowComments
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "Technology",
      tags: "",
      author: "Admin",
      status: "draft",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      featured: false,
      allowComments: true
    });
    setSelectedBlog(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Create a new blog post with rich content editor
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[80vh]">
              <BlogEditor
                authorization={getAuthHeaders().Authorization}
                onSave={async (data) => {
                  try {
                    const { Authorization } = getAuthHeaders();
                    const blogData = {
                      ...data,
                      tags: data.tags // data.tags is already an array from BlogEditor
                    };
                    await blogAPI.createBlog(blogData, Authorization);
                    setIsCreateDialogOpen(false);
                    resetForm();
                    fetchBlogs();
                    toast.success('Blog created successfully');
                  } catch (error) {
                    console.error('Create blog error:', error);
                    toast.error('Failed to create blog');
                    throw error;
                  }
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
                loading={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.overview?.totalBlogs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Blogs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.overview?.publishedBlogs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.overview?.draftBlogs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.overview?.totalViews || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {stats.overview?.featuredBlogs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category-filter">Category Filter</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{blog.excerpt}</p>
                </div>
                <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                  {blog.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{blog.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Author:</span>
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Views:</span>
                  <span>{blog.views}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reading Time:</span>
                  <span>{blog.readingTime} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Likes:</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    {blog.likeCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                {blog.featured && (
                  <div className="flex items-center justify-center">
                    <Badge variant="default" className="bg-yellow-500">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewDialog(blog)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(blog)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBlog(blog._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogs.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No blogs found</p>
            <p className="text-sm text-gray-400">Create your first blog post to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update blog post with rich content editor
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[80vh]">
            <BlogEditor
              authorization={getAuthHeaders().Authorization}
              initialData={{
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt,
                category: formData.category,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
                author: formData.author,
                status: formData.status as 'draft' | 'published',
                featuredImage: formData.featuredImage,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                featured: formData.featured,
                allowComments: formData.allowComments
              }}
              onSave={async (data) => {
                try {
                  const { Authorization } = getAuthHeaders();
                  const blogData = {
                    ...data,
                    tags: data.tags // data.tags is already an array from BlogEditor
                  };
                  if (selectedBlog) {
                    await blogAPI.updateBlog(selectedBlog._id, blogData, Authorization);
                    setIsEditDialogOpen(false);
                    resetForm();
                    fetchBlogs();
                    toast.success('Blog updated successfully');
                  }
                } catch (error) {
                  console.error('Update blog error:', error);
                  toast.error('Failed to update blog');
                  throw error;
                }
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              loading={false}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Details</DialogTitle>
            <DialogDescription>
              Complete information about the blog post
            </DialogDescription>
          </DialogHeader>
          
          {selectedBlog && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-lg font-semibold">{selectedBlog.title}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Excerpt</Label>
                <p className="text-gray-600">{selectedBlog.excerpt}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Content</Label>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Category</Label>
                  <p className="font-medium">{selectedBlog.category}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Author</Label>
                  <p className="font-medium">{selectedBlog.author}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <Badge variant={selectedBlog.status === 'published' ? 'default' : 'secondary'}>
                    {selectedBlog.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Views</Label>
                  <p className="font-medium">{selectedBlog.views}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Reading Time</Label>
                  <p className="font-medium">{selectedBlog.readingTime} minutes</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Featured</Label>
                  <Badge variant={selectedBlog.featured ? 'default' : 'secondary'}>
                    {selectedBlog.featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {selectedBlog.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedBlog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">Created</Label>
                  <p className="font-medium">{formatDate(selectedBlog.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Last Updated</Label>
                  <p className="font-medium">{formatDate(selectedBlog.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}