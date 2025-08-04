import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Eye, Star, MessageSquare, User, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { reviewAPI } from "@/lib/api";

interface Review {
  _id: string;
  name: string;
  image?: string;
  review: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const { getAuthHeaders } = useAdminAuth();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    review: "",
    status: "active" as 'active' | 'inactive'
  });

  // File upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [statusFilter]);

  const fetchReviews = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const data = await reviewAPI.getAllReviews(Authorization, params);
      setReviews(data.data || []);
    } catch (error) {
      console.error('Fetch reviews error:', error);
      toast.error('Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const data = await reviewAPI.getReviewStats(Authorization);
      setStats(data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleCreateReview = async () => {
    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Student name is required');
      return;
    }
    
    if (!formData.review.trim()) {
      toast.error('Review content is required');
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      // Handle image upload if selected
      let imageUrl = formData.image;
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        const uploadResponse = await reviewAPI.uploadReviewImage(imageFormData, Authorization);
        imageUrl = uploadResponse.data.imageUrl;
      }

      await reviewAPI.createReview({
        name: formData.name.trim(),
        image: imageUrl,
        review: formData.review.trim()
      }, Authorization);

      toast.success('Review created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Create review error:', error);
      toast.error('Failed to create review');
    }
  };

  const handleUpdateReview = async () => {
    if (!selectedReview) return;

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Student name is required');
      return;
    }
    
    if (!formData.review.trim()) {
      toast.error('Review content is required');
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      // Handle image upload if selected
      let imageUrl = formData.image;
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        const uploadResponse = await reviewAPI.uploadReviewImage(imageFormData, Authorization);
        imageUrl = uploadResponse.data.imageUrl;
      }

      await reviewAPI.updateReview(selectedReview._id, {
        name: formData.name.trim(),
        image: imageUrl,
        review: formData.review.trim(),
        status: formData.status
      }, Authorization);

      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Update review error:', error);
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await reviewAPI.deleteReview(reviewId, Authorization);
      toast.success('Review deleted successfully');
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Delete review error:', error);
      toast.error('Failed to delete review');
    }
  };

  const openEditDialog = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      name: review.name,
      image: review.image || "",
      review: review.review,
      status: review.status
    });
    setImagePreview(review.image || "");
    setSelectedImage(null);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      review: "",
      status: "active"
    });
    setSelectedImage(null);
    setImagePreview("");
    setSelectedReview(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
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
          <h1 className="text-3xl font-bold text-foreground">Student Reviews</h1>
          <p className="text-muted-foreground">Manage student testimonials and feedback</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Review</DialogTitle>
              <DialogDescription>
                Create a new student testimonial
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Student Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Preview" />
                    ) : (
                      <AvatarFallback>
                        <ImageIcon className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload a profile image (optional)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="review">Review *</Label>
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={(e) => setFormData({...formData, review: e.target.value})}
                  placeholder="Enter the student's review"
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReview}>
                Create Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.overview?.totalReviews || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.overview?.activeReviews || 0}
                </p>
                <p className="text-sm text-muted-foreground">Active Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.overview?.inactiveReviews || 0}
                </p>
                <p className="text-sm text-muted-foreground">Inactive Reviews</p>
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
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                                 <Avatar className="h-12 w-12">
                   {review.image ? (
                     <AvatarImage src={getImageUrl(review.image)} alt={review.name} />
                   ) : (
                     <AvatarFallback>
                       <User className="h-6 w-6" />
                     </AvatarFallback>
                   )}
                 </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{review.name}</h3>
                  <Badge variant={review.status === 'active' ? 'default' : 'secondary'}>
                    {review.status}
                  </Badge>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">{review.review}</p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>Created: {formatDate(review.createdAt)}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewDialog(review)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(review)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found</p>
            <p className="text-sm text-gray-400">Create your first review to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update the review information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Student Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter student name"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-image">Profile Image</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Preview" />
                  ) : (
                    <AvatarFallback>
                      <ImageIcon className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a new image (optional)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-review">Review *</Label>
              <Textarea
                id="edit-review"
                value={formData.review}
                onChange={(e) => setFormData({...formData, review: e.target.value})}
                placeholder="Enter the student's review"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive'})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReview}>
              Update Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete information about the review
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
                             <div className="flex items-center space-x-4">
                 <Avatar className="h-16 w-16">
                   {selectedReview.image ? (
                     <AvatarImage src={getImageUrl(selectedReview.image)} alt={selectedReview.name} />
                   ) : (
                     <AvatarFallback>
                       <User className="h-8 w-8" />
                     </AvatarFallback>
                   )}
                 </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedReview.name}</h3>
                  <Badge variant={selectedReview.status === 'active' ? 'default' : 'secondary'}>
                    {selectedReview.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Review</Label>
                <p className="text-gray-600 mt-1">{selectedReview.review}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">Created</Label>
                  <p className="font-medium">{formatDate(selectedReview.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Last Updated</Label>
                  <p className="font-medium">{formatDate(selectedReview.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
