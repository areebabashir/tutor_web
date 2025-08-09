'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { studentAPI, courseAPI } from '@/lib/api';

const studentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  qualification: z.string().min(2, 'Qualification must be at least 2 characters').max(100),
  selectedCourse: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface StudentEnrollmentFormProps {
  preSelectedCourseId?: string;
}

export default function StudentEnrollmentForm({ preSelectedCourseId }: StudentEnrollmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });



  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        setCourses(response.data);
        
        // Pre-select course if provided
        if (preSelectedCourseId) {
          console.log('Pre-selecting course:', preSelectedCourseId);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [preSelectedCourseId, setValue]);



  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('city', data.city);
      formData.append('qualification', data.qualification);
      
      // Add selected course
      if (preSelectedCourseId) {
        formData.append('courses', JSON.stringify([preSelectedCourseId]));
        
        // Add course name for display
        const selectedCourse = courses.find(course => course._id === preSelectedCourseId);
        if (selectedCourse) {
          formData.append('courseNames', JSON.stringify([selectedCourse.title]));
        }
      }

      await studentAPI.submitEnrollment(formData);
      toast.success('Student enrollment submitted successfully!');
      reset();
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to submit enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Student Enrollment Form</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Please fill out all the required information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Student Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...register('name')} placeholder="Enter your full name" />
                {errors.name && (
                  <Alert>
                    <AlertDescription>{errors.name.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" {...register('email')} placeholder="Enter your email" />
                {errors.email && (
                  <Alert>
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...register('phone')} placeholder="Enter your phone number" />
                {errors.phone && (
                  <Alert>
                    <AlertDescription>{errors.phone.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register('city')} placeholder="Enter your city" />
                {errors.city && (
                  <Alert>
                    <AlertDescription>{errors.city.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualifications *</Label>
              <Input
                id="qualification"
                {...register('qualification')}
                placeholder="e.g., Bachelor's Degree in Computer Science"
              />
              {errors.qualification && (
                <Alert>
                  <AlertDescription>{errors.qualification.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Course Selection Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Course Selection</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading available courses...</span>
              </div>
            ) : (
              <>
                {/* Add the courses dropdown here */}
                <div className="space-y-2">
                  <Label>Available Courses</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="View available courses" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title} - ${course.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">This is for display purposes only and doesn't affect your enrollment.</p>
                </div>

                <div className="space-y-2">
                  <Label>Selected Course</Label>
                  {preSelectedCourseId ? (
                    (() => {
                      const selectedCourseData = courses.find(course => course._id === preSelectedCourseId);
                      return selectedCourseData ? (
                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg text-gray-900">{selectedCourseData.title}</h4>
                            <Badge variant="default" className="bg-blue-500">
                              Pre-selected
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{selectedCourseData.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="outline">{selectedCourseData.category}</Badge>
                            <Badge variant="secondary">{selectedCourseData.level}</Badge>
                            <span className="text-gray-500">${selectedCourseData.price}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                          <p className="text-gray-500">Loading course information...</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                      <p className="text-gray-500">No course selected</p>
                      <p className="text-sm text-gray-400 mt-1">Please select a course from the course page</p>
                    </div>
                  )}
                                     
                 </div>
              </>
            )}
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Enrollment...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Submit Enrollment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
