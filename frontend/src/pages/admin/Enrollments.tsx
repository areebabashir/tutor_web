import { useState, useEffect } from "react";
import { Search, Download, Filter, Loader2, Eye, Mail, Phone, Trash2, Camera, User, MapPin, GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { studentAPI } from "@/lib/api";
import { Label } from "@/components/ui/label";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  courses?: Array<{
    _id: string;
    title: string;
    category: string;
    level: string;
    price: number;
  }>;
  courseNames?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminEnrollments() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { getAuthHeaders } = useAdminAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const data = await studentAPI.getAllStudents(Authorization);
      setStudents(data.data || []);
    } catch (error) {
      console.error('Fetch students error:', error);
      toast.error('Failed to fetch students');
      setStudents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student enrollment?')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await studentAPI.deleteStudent(studentId, Authorization);
      toast.success('Student enrollment deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student enrollment');
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      city: student.city,
      qualification: student.qualification,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;

    try {
      const { Authorization } = getAuthHeaders();
      const formData = new FormData();
      formData.append('name', editForm.name || '');
      formData.append('email', editForm.email || '');
      formData.append('phone', editForm.phone || '');
      formData.append('city', editForm.city || '');
      formData.append('qualification', editForm.qualification || '');

      await studentAPI.updateStudent(selectedStudent._id, formData, Authorization);
      toast.success('Student information updated successfully');
      setIsEditing(false);
      setEditForm({});
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update student information');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const filteredStudents = (students || []).filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.course && student.course.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportEnrollments = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Course', 'Enrollment Date', 'City', 'Qualification'],
      ...students.map(s => [
        s.name,
        s.email,
        s.phone,
        s.course,
        formatDate(s.createdAt),
        s.city,
        s.qualification
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-3xl font-bold text-foreground">Student Enrollments</h1>
          <p className="text-muted-foreground">Manage student enrollments and course registrations</p>
        </div>
        <Button onClick={exportEnrollments} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {students?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {students?.filter(s => s.courses && s.courses.some(c => c.category === 'IELTS')).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">IELTS Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {students?.filter(s => s.courses && s.courses.some(c => c.category === 'English Proficiency')).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">English Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Enrollments ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Enrolled Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.courses && student.courses.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {student.courses.map((course, index) => (
                          <Badge key={course._id} variant="outline" className="text-xs">
                            {course.title}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No courses selected</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{student.qualification}</p>
                  </TableCell>
                  <TableCell>
                    {formatDate(student.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {isEditing ? 'Edit Student Information' : 'Student Details'}
                            </DialogTitle>
                            <DialogDescription>
                              {isEditing ? 'Update student information' : `Complete information for ${student.name}`}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedStudent && (
                            <div className="space-y-6">
                              {/* Header with Avatar and Image Upload */}
                              <div className="flex items-start space-x-6">
                                <div className="relative">
                                  <Avatar className="h-24 w-24">
                                    {imagePreview ? (
                                      <AvatarImage src={imagePreview} alt={selectedStudent.name} />
                                    ) : (
                                      <AvatarFallback className="text-lg">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    )}
                                  </Avatar>
                                  {isEditing && (
                                    <div className="absolute -bottom-2 -right-2">
                                      <label htmlFor="image-upload" className="cursor-pointer">
                                        <div className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                          <Camera className="h-4 w-4" />
                                        </div>
                                        <input
                                          id="image-upload"
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={handleImageSelect}
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                    <Mail className="h-4 w-4" />
                                    <span>{selectedStudent.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedStudent.phone}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {isEditing ? (
                                <div className="space-y-6">
                                  {/* Image Upload Section */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center space-x-2">
                                        <Camera className="h-5 w-5 text-blue-600" />
                                        <span>Profile Picture</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center space-x-4">
                                        <Avatar className="h-20 w-20">
                                          {imagePreview ? (
                                            <AvatarImage src={imagePreview} alt="Preview" />
                                          ) : (
                                            <AvatarFallback className="text-lg">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                          )}
                                        </Avatar>
                                        <div>
                                          <label htmlFor="edit-image-upload" className="cursor-pointer">
                                            <Button variant="outline" className="gap-2">
                                              <Camera className="h-4 w-4" />
                                              {selectedImage ? 'Change Image' : 'Upload Image'}
                                            </Button>
                                            <input
                                              id="edit-image-upload"
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={handleImageSelect}
                                            />
                                          </label>
                                          {selectedImage && (
                                            <p className="text-sm text-gray-500 mt-1">
                                              Selected: {selectedImage.name}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Form Fields */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center space-x-2">
                                        <User className="h-5 w-5 text-green-600" />
                                        <span>Student Information</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-name">Name</Label>
                                      <Input
                                        id="edit-name"
                                        value={editForm.name || ''}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-email">Email</Label>
                                      <Input
                                        id="edit-email"
                                        type="email"
                                        value={editForm.email || ''}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-phone">Phone</Label>
                                      <Input
                                        id="edit-phone"
                                        value={editForm.phone || ''}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-city">City</Label>
                                      <Input
                                        id="edit-city"
                                        value={editForm.city || ''}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-course">Course</Label>
                                      <Input
                                        id="edit-course"
                                        value={editForm.course || ''}
                                        onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-qualification">Qualification</Label>
                                      <Input
                                        id="edit-qualification"
                                        value={editForm.qualification || ''}
                                        onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" onClick={handleCancelEdit}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleSaveEdit}>
                                      Save Changes
                                    </Button>
                                  </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {/* Detailed Information Cards */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center space-x-2">
                                          <User className="h-5 w-5 text-blue-600" />
                                          <span>Personal Information</span>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <Phone className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{selectedStudent.phone}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <MapPin className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm text-gray-500">City</p>
                                            <p className="font-medium">{selectedStudent.city}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center space-x-2">
                                          <GraduationCap className="h-5 w-5 text-green-600" />
                                          <span>Academic Information</span>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                          <GraduationCap className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm text-gray-500">Course</p>
                                            <p className="font-medium">{selectedStudent.course || 'Not specified'}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <GraduationCap className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm text-gray-500">Qualification</p>
                                            <p className="font-medium">{selectedStudent.qualification}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                        <span>Enrollment Details</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm text-gray-500">Enrolled Date</p>
                                          <p className="font-medium">{formatDate(selectedStudent.createdAt)}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <div className="flex justify-end pt-4">
                                    <Button onClick={() => handleEditStudent(selectedStudent)} className="gap-2">
                                      <User className="h-4 w-4" />
                                      Edit Information
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No student enrollments found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}