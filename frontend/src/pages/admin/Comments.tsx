import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MessageCircle, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Clock, 
  User, 
  Filter,
  Search,
  MoreHorizontal,
  Reply,
  Heart
} from 'lucide-react';
import { commentAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface CommentAuthor {
  name: string;
  email: string;
  avatar?: string;
}

interface BlogReference {
  _id: string;
  title: string;
  slug: string;
}

type BlogReferenceOrNull = BlogReference | null;

interface ParentComment {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

interface Comment {
  _id: string;
  content: string;
  author: CommentAuthor;
  blogId: BlogReferenceOrNull;
  parentComment?: ParentComment | null;
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
  replyCount: number;
  status: 'pending' | 'approved' | 'rejected';
  isAdminComment: boolean;
  createdAt: string;
}

interface CommentStats {
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
  rejectedComments: number;
  recentComments: Comment[];
}

const CommentsDashboard: React.FC = () => {
  const { adminToken } = useAdminAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    blogId: ''
  });

  // Fetch comments with current filters
  const fetchComments = async () => {
    if (!adminToken) return;
    
    try {
      setLoading(true);
      const response = await commentAPI.getAllComments(`Bearer ${adminToken}`, {
        page: currentPage,
        limit: 20,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.blogId && { blogId: filters.blogId }),
        ...(filters.search && { search: filters.search })
      });

      // Ensure we have valid data structure
      const safeComments = response.data.map(comment => ({
        ...comment,
        blogId: comment.blogId || null,
        parentComment: comment.parentComment || null
      }));

      setComments(safeComments);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comment statistics
  const fetchStats = async () => {
    if (!adminToken) return;
    
    try {
      const response = await commentAPI.getCommentStats(`Bearer ${adminToken}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load comment statistics');
    }
  };

  // Update comment status
  const handleStatusUpdate = async (commentId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setUpdating(commentId);
      await commentAPI.updateCommentStatus(commentId, status, `Bearer ${adminToken}`);
      
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? { ...comment, status } : comment
      ));
      
      toast.success(`Comment ${status} successfully`);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast.error(`Failed to update comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdating(null);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(commentId);
      await commentAPI.deleteComment(commentId, `Bearer ${adminToken}`);
      
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully');
      fetchStats();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setUpdating(null);
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const truncateText = (text: string = '', maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Effect hooks
  useEffect(() => {
    if (adminToken) {
      fetchComments();
      fetchStats();
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchComments();
    }
  }, [currentPage, filters]);

  if (!adminToken) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to access comments management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comments Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and moderate blog comments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">
            {stats?.totalComments || 0} Comments
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalComments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingComments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.approvedComments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.rejectedComments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Actions</label>
              <Button
                variant="outline"
                onClick={() => setFilters({ status: 'all', search: '', blogId: '' })}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No comments found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Blog</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-xs">
                                {getInitials(comment.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{comment.author.name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{comment.author.email || 'No email'}</p>
                              {comment.isAdminComment && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  <Check className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 mb-1">
                              {truncateText(comment.content, 80)}
                            </p>
                            {comment.parentComment && (
                              <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                                <Reply className="h-3 w-3 inline mr-1" />
                                Reply to: {truncateText(comment.parentComment.content, 50)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900">
                              {comment.blogId?.title || 'Deleted Blog'}
                            </p>
                            {comment.blogId && (
                              <p className="text-xs text-muted-foreground">
                                /blog/{comment.blogId.slug}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(comment.status)}>
                            {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{comment.likeCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900">
                            {formatDate(comment.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {comment.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(comment._id, 'approved')}
                                  disabled={updating === comment._id}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(comment._id, 'rejected')}
                                  disabled={updating === comment._id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteComment(comment._id)}
                              disabled={updating === comment._id}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsDashboard;