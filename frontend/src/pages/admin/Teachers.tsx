import { useState } from "react";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockTeachers, type Teacher } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    email: '',
    phone: '',
    bio: '',
    image: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      expertise: '',
      email: '',
      phone: '',
      bio: '',
      image: ''
    });
  };

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name: formData.name,
      expertise: formData.expertise,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      image: formData.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      coursesCount: 0
    };

    setTeachers([...teachers, newTeacher]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Teacher added",
      description: "New teacher has been successfully added.",
    });
  };

  const handleEditTeacher = () => {
    if (!editingTeacher) return;

    const updatedTeachers = teachers.map(teacher =>
      teacher.id === editingTeacher.id
        ? {
            ...teacher,
            name: formData.name,
            expertise: formData.expertise,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            image: formData.image || teacher.image
          }
        : teacher
    );

    setTeachers(updatedTeachers);
    setEditingTeacher(null);
    resetForm();
    toast({
      title: "Teacher updated",
      description: "Teacher has been successfully updated.",
    });
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    toast({
      title: "Teacher deleted",
      description: "Teacher has been successfully deleted.",
    });
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      expertise: teacher.expertise,
      email: teacher.email,
      phone: teacher.phone,
      bio: teacher.bio,
      image: teacher.image
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage your teaching staff</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Add a new teacher to your platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter teacher's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                  placeholder="e.g. Full-Stack Development"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="teacher@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief description about the teacher"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL (optional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button onClick={handleAddTeacher} className="w-full" variant="gradient">
                Add Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-lg">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.expertise}</p>
                </div>

                <p className="text-sm text-center">{teacher.bio}</p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-32">{teacher.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">{teacher.coursesCount} Courses</p>
                </div>

                <div className="flex space-x-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(teacher)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expertise">Expertise</Label>
              <Input
                id="edit-expertise"
                value={formData.expertise}
                onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Profile Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
            <Button onClick={handleEditTeacher} className="w-full" variant="gradient">
              Update Teacher
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}