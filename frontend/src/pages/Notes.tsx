import React, { useState, useEffect } from 'react';
import { notesAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Download, Eye, FileText, Calendar, User, Tag, Filter, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

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
        category: categoryFilter || undefined,
        difficulty: difficultyFilter || undefined
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
      await notesAPI.downloadNotes(id);
      const note = notes.find(n => n._id === id);
      if (note) {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${note.fileUrl}`;
        link.download = note.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
        // Refresh the notes to update download count
        fetchNotes();
      }
    } catch (error) {
      console.error('Error downloading notes:', error);
      toast.error('Failed to download notes');
    }
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
      case 'Beginner': return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Educational Notes & Materials
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Access comprehensive study materials, notes, and resources to enhance your learning journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{totalItems}</div>
                <div className="text-blue-100">Available Notes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{categories.length}</div>
                <div className="text-blue-100">Categories</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{difficulties.length}</div>
                <div className="text-blue-100">Difficulty Levels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white/80 backdrop-blur-sm">
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
                  className="pl-10 bg-white/90 backdrop-blur-sm border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All difficulties</SelectItem>
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
                setCategoryFilter('');
                setDifficultyFilter('');
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                          {note.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
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

                        <Button 
                          onClick={() => handleDownload(note._id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Notes
                        </Button>
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
                            className={currentPage === page ? 'bg-blue-600 text-white' : 'cursor-pointer'}
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
    </div>
  );
};

export default Notes; 