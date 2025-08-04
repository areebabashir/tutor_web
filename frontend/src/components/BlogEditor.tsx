import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Video, 
  Code, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Undo, 
  Redo,
  Eye,
  EyeOff,
  Save,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI } from '@/lib/api';

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    author: string;
    status: 'draft' | 'published';
    featuredImage: string;
    metaTitle: string;
    metaDescription: string;
    featured: boolean;
    allowComments: boolean;
  };
  onSave: (data: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  authorization?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  loading = false,
  authorization
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'Technology',
    tags: initialData?.tags?.join(', ') || '',
    author: initialData?.author || 'Admin',
    status: initialData?.status || 'draft',
    featuredImage: initialData?.featuredImage || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    featured: initialData?.featured || false,
    allowComments: initialData?.allowComments ?? true
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);

  // Quill editor configuration
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'code-block'],
        ['blockquote', 'code'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image', 'video', 'code-block',
    'blockquote', 'code'
  ];

  // Image upload handler
  function imageHandler() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!authorization) {
      toast.error('Authorization required for image upload');
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const response = await blogAPI.uploadBlogImage(formData, authorization);
      const imageUrl = `http://localhost:8000${response.data.imageUrl}`;
      
      // Insert image into editor
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
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

    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    try {
      await onSave(blogData);
      toast.success('Blog saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save blog');
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const readingTime = Math.ceil(formData.content.split(' ').length / 200);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Editor</h2>
          <p className="text-muted-foreground">Create and edit your blog post</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="gap-2"
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter blog title"
                      className="text-lg font-semibold"
                    />
                    {formData.title && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Slug: {generateSlug(formData.title)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Enter blog excerpt (max 300 characters)"
                      rows={3}
                      maxLength={300}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.excerpt.length}/300 characters
                    </p>
                  </div>

                  <div>
                    <Label>Content *</Label>
                    <div className="border rounded-md">
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write your blog content here..."
                        style={{ height: '400px' }}
                      />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    {imageUploading && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploading image...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'draft' | 'published'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    <Label htmlFor="featured">Featured Post</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowComments"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({...formData, allowComments: e.target.checked})}
                    />
                    <Label htmlFor="allowComments">Allow Comments</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reading Time:</span>
                    <span className="text-sm font-medium">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Word Count:</span>
                    <span className="text-sm font-medium">{formData.content.split(' ').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Character Count:</span>
                    <span className="text-sm font-medium">{formData.content.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                  placeholder="Enter image URL"
                />
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured" 
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowComments"
                  checked={formData.allowComments}
                  onChange={(e) => setFormData({...formData, allowComments: e.target.checked})}
                />
                <Label htmlFor="allowComments">Allow Comments</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                  placeholder="Enter meta title for SEO"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  placeholder="Enter meta description for SEO"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label>SEO Preview</Label>
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="text-blue-600 text-sm truncate">
                    {formData.metaTitle || 'Your page title will appear here'}
                  </div>
                  <div className="text-green-600 text-sm truncate">
                    {window.location.origin}/blog/{generateSlug(formData.title)}
                  </div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {formData.metaDescription || 'Your meta description will appear here'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Mode */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose prose-lg max-w-none">
              <h1>{formData.title || 'Untitled Blog Post'}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>By {formData.author}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
                <span>•</span>
                <Badge variant="secondary">{formData.category}</Badge>
              </div>
              {formData.featuredImage && (
                <img 
                  src={formData.featuredImage} 
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </article>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogEditor; 