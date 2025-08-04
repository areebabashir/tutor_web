import React, { useState, useEffect } from 'react';
import { notesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Download, Eye, FileText, Calendar, User, Tag, Filter, BookOpen, Info, Star, Clock, Share2, Bookmark, ExternalLink, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Notes {
  _id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  difficulty: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  tags: string[];
  downloads: number;
  views: number;
  createdBy: {
    name: string;
  };
  createdAt: string;
  formattedFileSize?: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Modal states
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const categories = ['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Listening', 'Speaking', 'General'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchNotes();
  }, [currentPage, searchTerm, categoryFilter, difficultyFilter]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getPublicNotes({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        category: categoryFilter === 'all' ? undefined : categoryFilter || undefined,
        difficulty: difficultyFilter === 'all' ? undefined : difficultyFilter || undefined
      });

      setNotes(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloading(id);
      await notesAPI.downloadNotes(id);
      const note = notes.find(n => n._id === id);
      if (note) {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${note.fileUrl}`;
        link.download = note.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started successfully!');
        // Refresh the notes to update download count
        fetchNotes();
      }
    } catch (error) {
      console.error('Error downloading notes:', error);
      toast.error('Failed to download notes');
    } finally {
      setDownloading(null);
    }
  };

  const openNoteDetails = (note: Notes) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('ppt')) return '📊';
    if (fileType.includes('xls')) return '📈';
    if (fileType.includes('txt')) return '📄';
    return '📁';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-primary/10 text-primary';
      case 'Intermediate': return 'bg-orange-100 text-orange-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grammar': return '📚';
      case 'Vocabulary': return '📖';
      case 'Reading': return '👁️';
      case 'Writing': return '✍️';
      case 'Listening': return '👂';
      case 'Speaking': return '🗣️';
      case 'General': return '📋';
      default: return '📄';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '⭐';
      case 'Intermediate': return '⭐⭐';
      case 'Advanced': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Study Materials
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Educational Notes & Materials
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Access comprehensive study materials, notes, and resources to enhance your learning journey
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search Notes</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, subject, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setDifficultyFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading educational materials...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Educational Materials ({totalItems})
                </h2>
                <p className="text-gray-600">
                  Browse and download comprehensive study materials for your learning needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notes.map((note) => (
                  <Card key={note._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl">{getFileIcon(note.fileType)}</span>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryIcon(note.category)} {note.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(note.difficulty)}`}>
                          {getDifficultyStars(note.difficulty)} {note.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => openNoteDetails(note)}>
                        {note.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {note.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {note.fileName}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {note.formattedFileSize}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{note.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{note.downloads} downloads</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(note.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{note.createdBy?.name}</span>
                          </div>
                        </div>

                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="w-2 h-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => openNoteDetails(note)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                          <Button 
                            onClick={() => handleDownload(note._id)}
                            disabled={downloading === note._id}
                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                          >
                            {downloading === note._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {downloading === note._id ? 'Downloading...' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'bg-primary text-white' : 'cursor-pointer'}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Note Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{getFileIcon(selectedNote.fileType)}</div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedNote.title}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedNote.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* File Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    File Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">File Name:</span>
                      <p className="text-gray-600">{selectedNote.fileName}</p>
                    </div>
                    <div>
                      <span className="font-medium">File Size:</span>
                      <p className="text-gray-600">{selectedNote.formattedFileSize}</p>
                    </div>
                    <div>
                      <span className="font-medium">File Type:</span>
                      <p className="text-gray-600">{selectedNote.fileType}</p>
                    </div>
                    <div>
                      <span className="font-medium">Subject:</span>
                      <p className="text-gray-600">{selectedNote.subject}</p>
                    </div>
                  </div>
                </div>

                {/* Categories and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      {getCategoryIcon(selectedNote.category)}
                      Category
                    </h3>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {selectedNote.category}
                    </Badge>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      {getDifficultyStars(selectedNote.difficulty)}
                      Difficulty
                    </h3>
                    <Badge className={`text-base px-3 py-1 ${getDifficultyColor(selectedNote.difficulty)}`}>
                      {selectedNote.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{selectedNote.views}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{selectedNote.downloads}</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{formatDate(selectedNote.createdAt)}</div>
                      <div className="text-sm text-gray-600">Created</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Author Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedNote.createdBy?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="font-medium">{selectedNote.createdBy?.name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-600">Content Creator</div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleDownload(selectedNote._id);
                    setIsModalOpen(false);
                  }}
                  disabled={downloading === selectedNote._id}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  {downloading === selectedNote._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Notes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Notes; 