import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Loader2, Search, Eye, Download, Trash2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  qualification: string;
  subject: string;
  expertAt: string;
  appliedFor: 'IELTS' | 'English' | 'Quran';
  whyFitForJob: string;
  image: string;
  resume: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teachers');
      const data = await response.json();
      
      if (response.ok) {
        setTeachers(data.data);
      } else {
        toast.error('Failed to fetch teachers');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher application?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/teachers/${teacherId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Teacher application deleted successfully');
        fetchTeachers();
      } else {
        toast.error('Failed to delete teacher application');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterSubject === 'all' || teacher.appliedFor === filterSubject;
    
    return matchesSearch && matchesFilter;
  });

  const getSubjectBadgeColor = (subject: string) => {
    switch (subject) {
      case 'IELTS':
        return 'bg-blue-100 text-blue-800';
      case 'English':
        return 'bg-green-100 text-green-800';
      case 'Quran':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Applications</h1>
          <p className="text-gray-600">Manage teacher applications and view candidate details</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredTeachers.length} applications
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Quran">Quran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <div className="grid gap-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher._id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`http://localhost:8000/uploads/images/${teacher.image}`} />
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{teacher.name}</h3>
                      <Badge className={getSubjectBadgeColor(teacher.appliedFor)}>
                        {teacher.appliedFor}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{teacher.contactNumber}</span>
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span> {teacher.subject}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {formatDate(teacher.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">Expertise:</span> {teacher.expertAt}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Teacher Application Details</DialogTitle>
                        <DialogDescription>
                          Complete information for {teacher.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedTeacher && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={`http://localhost:8000/uploads/images/${selectedTeacher.image}`} />
                              <AvatarFallback>{selectedTeacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{selectedTeacher.name}</h3>
                              <p className="text-gray-600">{selectedTeacher.email}</p>
                              <Badge className={`mt-2 ${getSubjectBadgeColor(selectedTeacher.appliedFor)}`}>
                                {selectedTeacher.appliedFor}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium">Contact Number</label>
                              <p className="text-gray-600">{selectedTeacher.contactNumber}</p>
                            </div>
                            <div>
                              <label className="font-medium">Gender</label>
                              <p className="text-gray-600">{selectedTeacher.gender}</p>
                            </div>
                            <div>
                              <label className="font-medium">Date of Birth</label>
                              <p className="text-gray-600">{formatDate(selectedTeacher.dateOfBirth)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Qualification</label>
                              <p className="text-gray-600">{selectedTeacher.qualification}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="font-medium">Address</label>
                            <p className="text-gray-600">
                              {selectedTeacher.address}, {selectedTeacher.city}, {selectedTeacher.state}, {selectedTeacher.country} {selectedTeacher.zipCode}
                            </p>
                          </div>
                          
                          <div>
                            <label className="font-medium">Subject</label>
                            <p className="text-gray-600">{selectedTeacher.subject}</p>
                          </div>
                          
                          <div>
                            <label className="font-medium">Expertise</label>
                            <p className="text-gray-600">{selectedTeacher.expertAt}</p>
                          </div>
                          
                          <div>
                            <label className="font-medium">Why Fit for This Job</label>
                            <p className="text-gray-600">{selectedTeacher.whyFitForJob}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`http://localhost:8000/uploads/images/${selectedTeacher.image}`, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Image
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`http://localhost:8000/uploads/resumes/${selectedTeacher.resume}`, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Resume
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTeacher(teacher._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No teacher applications found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}