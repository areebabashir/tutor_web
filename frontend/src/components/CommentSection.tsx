import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';
import { Heart, MessageCircle, Reply, MoreHorizontal, Check, X } from 'lucide-react';
import { commentAPI } from '../lib/api';
import { toast } from 'sonner';

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  likes: Array<{
    userEmail: string;
    likedAt: string;
  }>;
  likeCount: number;
  replyCount: number;
  replies: Comment[];
  createdAt: string;
  isAdminComment: boolean;
  status: string;
}

interface CommentSectionProps {
  blogId: string;
  currentUserEmail?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId, currentUserEmail }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch comments
  const fetchComments = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const response = await commentAPI.getBlogComments(blogId, {
        page,
        limit: 10,
        status: 'approved'
      });

      if (append) {
        setComments(prev => [...prev, ...response.data]);
      } else {
        setComments(response.data);
      }

      setHasMore(response.pagination.hasNextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!currentUserEmail) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await commentAPI.createComment({
        blogId,
        content: newComment.trim(),
        author: {
          name: 'Anonymous', // You can get this from user context
          email: currentUserEmail,
        }
      });

      setNewComment('');
      toast.success('Comment submitted successfully! It will be visible after approval.');
      
      // Refresh comments to show the new one
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    if (!currentUserEmail) {
      toast.error('Please log in to reply');
      return;
    }

    try {
      setSubmitting(true);
      await commentAPI.createComment({
        blogId,
        content: replyContent.trim(),
        parentCommentId,
        author: {
          name: 'Anonymous', // You can get this from user context
          email: currentUserEmail,
        }
      });

      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply submitted successfully! It will be visible after approval.');
      
      // Refresh comments to show the new reply
      fetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle like
  const handleToggleLike = async (commentId: string) => {
    if (!currentUserEmail) {
      toast.error('Please log in to like comments');
      return;
    }

    try {
      const response = await commentAPI.toggleLike(commentId, currentUserEmail);
      
      // Update the comment's like count and status
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likes: response.data.liked 
              ? [...comment.likes, { userEmail: currentUserEmail, likedAt: new Date().toISOString() }]
              : comment.likes.filter(like => like.userEmail !== currentUserEmail),
            likeCount: response.data.likeCount
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  // Check if user liked a comment
  const isLiked = (comment: Comment) => {
    return comment.likes.some(like => like.userEmail === currentUserEmail);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Leave a Comment</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {currentUserEmail ? 'Comment will be visible after approval' : 'Please log in to comment'}
              </p>
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim() || !currentUserEmail}
                className="bg-gradient-to-r from-primary to-accent text-white"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Comments ({comments.length})
          </h3>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        </div>

        {comments.length === 0 && !loading && (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        )}

        {comments.map((comment) => (
          <Card key={comment._id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                    {getInitials(comment.author.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{comment.author.name}</span>
                    {comment.isAdminComment && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        isLiked(comment) 
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked(comment) ? 'fill-current' : ''}`} />
                      <span>{comment.likeCount}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(comment._id)}
                          disabled={submitting || !replyContent.trim()}
                          className="bg-gradient-to-r from-primary to-accent text-white"
                        >
                          {submitting ? 'Posting...' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="ml-6 space-y-2">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-xs">
                                {getInitials(reply.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{reply.author.name}</span>
                                {reply.isAdminComment && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              
                              <p className="text-sm leading-relaxed">{reply.content}</p>
                              
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleToggleLike(reply._id)}
                                  className={`flex items-center space-x-1 text-xs transition-colors ${
                                    isLiked(reply) 
                                      ? 'text-red-500' 
                                      : 'text-muted-foreground hover:text-red-500'
                                  }`}
                                >
                                  <Heart className={`h-3 w-3 ${isLiked(reply) ? 'fill-current' : ''}`} />
                                  <span>{reply.likeCount}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        {hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => fetchComments(currentPage + 1, true)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Comments'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 