import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, BookOpen, Video, Image } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { courseAPI } from "@/lib/api";
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: 'IELTS preparation' | 'Spoken English' | 'English for competitive exams' | 'GRE Vocabulary';
  video: string;
  image: string;
  syllabus: string;
  features: string[];
  duration: {
    startDate: string;
    endDate: string;
  };
  instructorName: string;
  price: number;
  status: 'active' | 'inactive' | 'upcoming';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;
}



export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { getAuthHeaders } = useAdminAuth();
  const { handleError, handleAsyncError } = useErrorHandler();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "IELTS preparation" as 'IELTS preparation' | 'Spoken English' | 'English for competitive exams' | 'GRE Vocabulary',
    video: "",
    image: "",
    syllabus: "",
    features: [] as string[],
    duration: {
      startDate: "",
      endDate: ""
    },
    instructorName: "",
    price: 0,
    status: "upcoming" as 'active' | 'inactive' | 'upcoming',
    level: "beginner" as 'beginner' | 'intermediate' | 'advanced',
    tags: [] as string[],
    requirements: [] as string[],
    learningOutcomes: [] as string[]
  });

  // File upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAllCourses({
        search: searchTerm || undefined,
        category: categoryFilter === 'all' ? undefined : categoryFilter || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter || undefined
      });
      setCourses(data.data);
    } catch (error) {
      handleError(error, {
        title: 'Failed to fetch courses',
        description: 'Unable to load course data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };



  const handleCreateCourse = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.syllabus || !formData.instructorName) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (!formData.duration.startDate || !formData.duration.endDate) {
        toast.error('Please select start and end dates');
        return;
      }
      
      // Validate date range
      if (new Date(formData.duration.startDate) >= new Date(formData.duration.endDate)) {
        toast.error('End date must be after start date');
        return;
      }
      
      const { Authorization } = getAuthHeaders();
      
      // Create FormData for file upload
      const courseFormData = new FormData();
      
      // Add course data
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('category', formData.category);
      courseFormData.append('syllabus', formData.syllabus);
      courseFormData.append('instructorName', formData.instructorName);
      courseFormData.append('status', formData.status);
      courseFormData.append('level', formData.level);
      courseFormData.append('duration', JSON.stringify(formData.duration));
      
      // Add files if selected
      if (selectedImage) {
        courseFormData.append('image', selectedImage);
      }
      if (selectedVideo) {
        courseFormData.append('video', selectedVideo);
      }
      
      // Add optional fields
      if (formData.features.length > 0) {
        courseFormData.append('features', JSON.stringify(formData.features));
      }
      if (formData.tags.length > 0) {
        courseFormData.append('tags', JSON.stringify(formData.tags));
      }
      if (formData.requirements.length > 0) {
        courseFormData.append('requirements', JSON.stringify(formData.requirements));
      }
      if (formData.learningOutcomes.length > 0) {
        courseFormData.append('learningOutcomes', JSON.stringify(formData.learningOutcomes));
      }
      
      await courseAPI.createCourse(courseFormData, Authorization);
      
      toast.success('Course created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      handleError(error, {
        title: 'Failed to create course',
        description: 'Unable to create the course. Please check your input and try again.'
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.syllabus || !formData.instructorName) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (!formData.duration.startDate || !formData.duration.endDate) {
        toast.error('Please select start and end dates');
        return;
      }
      
      // Validate date range
      if (new Date(formData.duration.startDate) >= new Date(formData.duration.endDate)) {
        toast.error('End date must be after start date');
        return;
      }
      
      const { Authorization } = getAuthHeaders();
      
      // Create FormData for file upload
      const courseFormData = new FormData();
      
      // Add course data
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('category', formData.category);
      courseFormData.append('syllabus', formData.syllabus);
      courseFormData.append('instructorName', formData.instructorName);
      courseFormData.append('status', formData.status);
      courseFormData.append('level', formData.level);
      courseFormData.append('duration', JSON.stringify(formData.duration));
      
      // Add files if selected
      if (selectedImage) {
        courseFormData.append('image', selectedImage);
      }
      if (selectedVideo) {
        courseFormData.append('video', selectedVideo);
      }
      
      // Add optional fields
      if (formData.features.length > 0) {
        courseFormData.append('features', JSON.stringify(formData.features));
      }
      if (formData.tags.length > 0) {
        courseFormData.append('tags', JSON.stringify(formData.tags));
      }
      if (formData.requirements.length > 0) {
        courseFormData.append('requirements', JSON.stringify(formData.requirements));
      }
      if (formData.learningOutcomes.length > 0) {
        courseFormData.append('learningOutcomes', JSON.stringify(formData.learningOutcomes));
      }
      
      await courseAPI.updateCourse(selectedCourse._id, courseFormData, Authorization);
      
      toast.success('Course updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      handleError(error, {
        title: 'Failed to update course',
        description: 'Unable to update the course. Please check your input and try again.'
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await courseAPI.deleteCourse(courseId, Authorization);
      
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      handleError(error, {
        title: 'Failed to delete course',
        description: 'Unable to delete the course. Please try again.'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "IELTS preparation",
      video: "",
      image: "",
      syllabus: "",
      features: [],
      duration: {
        startDate: "",
        endDate: ""
      },
      instructorName: "",
      price: 0,
      status: "upcoming",
      level: "beginner",
      tags: [],
      requirements: [],
      learningOutcomes: []
    });
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview("");
    setVideoPreview("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      video: course.video,
      image: course.image,
      syllabus: course.syllabus,
      features: course.features,
      duration: course.duration,
      instructorName: course.instructorName,
      price: course.price,
      status: course.status,
      level: course.level,
      tags: course.tags,
      requirements: course.requirements,
      learningOutcomes: course.learningOutcomes
    });
    
    // Set previews for existing files with proper URL construction
    if (course.image) {
      const imageUrl = course.image.startsWith('data:') || course.image.startsWith('http://') || course.image.startsWith('https://')
        ? course.image
        : course.image.startsWith('/')
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.image}`
          : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/images/${course.image}`;
      setImagePreview(imageUrl);
    }
    if (course.video) {
      const videoUrl = course.video.startsWith('data:') || course.video.startsWith('http://') || course.video.startsWith('https://')
        ? course.video
        : course.video.startsWith('/')
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${course.video}`
          : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/videos/${course.video}`;
      setVideoPreview(videoUrl);
    }
    
    setSelectedImage(null);
    setSelectedVideo(null);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: 'active' | 'inactive' | 'upcoming') => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: 'active' | 'inactive' | 'upcoming') => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'inactive': return 'destructive' as const;
      case 'upcoming': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const getCategoryColor = (category: 'IELTS preparation' | 'Spoken English' | 'English for competitive exams' | 'GRE Vocabulary') => {
    switch (category) {
      case 'IELTS preparation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Spoken English':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'English for competitive exams':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'GRE Vocabulary':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Helper function to format image URL
  const formatImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // If it starts with /uploads/, it's already a proper path
    if (imageUrl.startsWith('/uploads/')) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      return `${backendUrl}${imageUrl}`;
    }
    
    // If it's just a filename, construct the full path
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${backendUrl}/uploads/images/${imageUrl}`;
  };

  // Helper function to format video URL
  const formatVideoUrl = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    // YouTube URL handling
    if (videoUrl.includes('youtube.com/watch?v=')) {
      return videoUrl.replace('watch?v=', 'embed/');
    }
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo URL handling
    if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Direct video file - check if it's a relative path from backend
    if (videoUrl.startsWith('/uploads/')) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      return `${backendUrl}${videoUrl}`;
    }
    
    // If it's already a full URL, return as is
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      return videoUrl;
    }
    
    // Default case - assume it's a relative path
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${backendUrl}${videoUrl}`;
  };

  // Helper function to get video type
  const getVideoType = (videoUrl: string) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return 'youtube';
    }
    if (videoUrl.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'direct';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-gray-600">Manage your courses and content</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                <SelectItem value="Spoken English">Spoken English</SelectItem>
                <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchCourses} variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getCategoryColor(course.category)}>
                      {course.category}
                    </Badge>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    <Badge variant="outline">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {course.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {course.instructorName}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(course.duration.startDate)} - {formatDate(course.duration.endDate)}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {course.features.length} features
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Created: {formatDate(course.createdAt)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsVideoDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No courses found</p>
            <p className="text-sm text-gray-400">Create your first course to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Add a new course to your platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Course title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                    <SelectItem value="Spoken English">Spoken English</SelectItem>
                    <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                    <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Course description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {videoPreview && (
                  <div className="mt-2">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        console.error('Video failed to load:', videoPreview);
                        toast.error('Failed to load video preview');
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="image">Image File</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        console.error('Image failed to load:', imagePreview);
                        toast.error('Failed to load image preview');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="syllabus">Syllabus</Label>
              <Textarea
                id="syllabus"
                value={formData.syllabus}
                onChange={(e) => setFormData({...formData, syllabus: e.target.value})}
                placeholder="Course syllabus"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="instructor">Instructor Name</Label>
                <Input
                  id="instructor"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({...formData, instructorName: e.target.value})}
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.duration.startDate}
                  onChange={(e) => setFormData({
                    ...formData, 
                    duration: {...formData.duration, startDate: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.duration.endDate}
                  onChange={(e) => setFormData({
                    ...formData, 
                    duration: {...formData.duration, endDate: e.target.value}
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requirements */}
            <div>
              <Label>Requirements</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          requirements: [...formData.requirements, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements.map((requirement, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        requirements: formData.requirements.filter((_, i) => i !== index)
                      });
                    }}>
                      {requirement} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Outcomes */}
            <div>
              <Label>Learning Outcomes</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a learning outcome"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          learningOutcomes: [...formData.learningOutcomes, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.learningOutcomes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.learningOutcomes.map((outcome, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        learningOutcomes: formData.learningOutcomes.filter((_, i) => i !== index)
                      });
                    }}>
                      {outcome} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        features: formData.features.filter((_, i) => i !== index)
                      });
                    }}>
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index)
                      });
                    }}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>
              Create Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Course title"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value: 'IELTS preparation' | 'Spoken English' | 'English for competitive exams' | 'GRE Vocabulary') => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                    <SelectItem value="Spoken English">Spoken English</SelectItem>
                    <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                    <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Course description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-video">Video File</Label>
                <Input
                  id="edit-video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {videoPreview && (
                  <div className="mt-2">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        console.error('Video failed to load:', videoPreview);
                        toast.error('Failed to load video preview');
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="edit-image">Image File</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        console.error('Image failed to load:', imagePreview);
                        toast.error('Failed to load image preview');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-syllabus">Syllabus</Label>
              <Textarea
                id="edit-syllabus"
                value={formData.syllabus}
                onChange={(e) => setFormData({...formData, syllabus: e.target.value})}
                placeholder="Course syllabus"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-instructor">Instructor Name</Label>
                <Input
                  id="edit-instructor"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({...formData, instructorName: e.target.value})}
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.duration.startDate}
                  onChange={(e) => setFormData({
                    ...formData, 
                    duration: {...formData.duration, startDate: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.duration.endDate}
                  onChange={(e) => setFormData({
                    ...formData, 
                    duration: {...formData.duration, endDate: e.target.value}
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div>
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        features: formData.features.filter((_, i) => i !== index)
                      });
                    }}>
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => {
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index)
                      });
                    }}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse}>
              Update Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Details Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Course Details</DialogTitle>
            <DialogDescription>
              Complete information about the course
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              {/* Debug logging */}
              {(() => {
                console.log('View Course Debug:', {
                  image: {
                    original: selectedCourse.image,
                    formatted: formatImageUrl(selectedCourse.image)
                  },
                  video: {
                    original: selectedCourse.video,
                    formatted: formatVideoUrl(selectedCourse.video),
                    type: getVideoType(selectedCourse.video)
                  }
                });
                return null;
              })()}
              
              {/* Course Header */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    {selectedCourse.image ? (
                      <img 
                        src={formatImageUrl(selectedCourse.image)} 
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', selectedCourse.image);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gray-300';
                          fallback.innerHTML = '<svg class="h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Image className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mt-2">
                    <User className="h-4 w-4" />
                    <span>Instructor: {selectedCourse.instructorName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Category: {selectedCourse.category}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Duration: {formatDate(selectedCourse.duration.startDate)} - {formatDate(selectedCourse.duration.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Course Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>Course Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={getStatusVariant(selectedCourse.status)}>
                        {selectedCourse.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <Badge variant="outline">{selectedCourse.level}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm">{selectedCourse.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Video className="h-5 w-5 text-green-600" />
                      <span>Course Content</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Syllabus</p>
                      <p className="text-sm">{selectedCourse.syllabus}</p>
                    </div>
                    {selectedCourse.video && (
                      <div>
                        <p className="text-sm text-gray-500">Video</p>
                        {getVideoType(selectedCourse.video) === 'youtube' ? (
                          <iframe
                            src={formatVideoUrl(selectedCourse.video)}
                            title="Course Preview"
                            className="w-full h-48 rounded"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : getVideoType(selectedCourse.video) === 'vimeo' ? (
                          <iframe
                            src={formatVideoUrl(selectedCourse.video)}
                            title="Course Preview"
                            className="w-full h-48 rounded"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video 
                            controls 
                            className="w-full h-48 object-cover rounded"
                            poster={formatImageUrl(selectedCourse.image)}
                            onError={(e) => {
                              console.error('Video failed to load:', selectedCourse.video);
                              const target = e.target as HTMLVideoElement;
                              target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500';
                              fallback.textContent = 'Video preview unavailable';
                              target.parentNode?.appendChild(fallback);
                            }}
                          >
                            <source src={formatVideoUrl(selectedCourse.video)} type="video/mp4" />
                            <source src={formatVideoUrl(selectedCourse.video)} type="video/webm" />
                            <source src={formatVideoUrl(selectedCourse.video)} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              {selectedCourse.features && selectedCourse.features.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Course Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {selectedCourse.requirements && selectedCourse.requirements.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCourse.requirements.map((requirement, index) => (
                        <li key={index} className="text-sm">{requirement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Learning Outcomes */}
              {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Learning Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCourse.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="text-sm">{outcome}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Course Statistics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span>Course Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(selectedCourse.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(selectedCourse.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}