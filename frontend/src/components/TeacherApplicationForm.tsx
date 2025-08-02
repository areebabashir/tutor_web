import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

// Validation schema
const teacherFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 characters').max(15, 'Contact number must be less than 15 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters'),
  city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City must be less than 50 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters').max(50, 'Country must be less than 50 characters'),
  state: z.string().min(2, 'State must be at least 2 characters').max(50, 'State must be less than 50 characters'),
  zipCode: z.string().min(3, 'Zip code must be at least 3 characters').max(10, 'Zip code must be less than 10 characters'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  qualification: z.string().min(2, 'Qualification must be at least 2 characters').max(100, 'Qualification must be less than 100 characters'),
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(50, 'Subject must be less than 50 characters'),
  expertAt: z.string().min(5, 'Expert at must be at least 5 characters').max(200, 'Expert at must be less than 200 characters'),
  appliedFor: z.enum(['IELTS', 'English', 'Quran']),
  whyFitForJob: z.string().min(10, 'Why you fit for this job must be at least 10 characters').max(1000, 'Why you fit for this job must be less than 1000 characters'),
});

type TeacherFormData = z.infer<typeof teacherFormSchema>;

interface TeacherApplicationFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function TeacherApplicationForm({ onSuccess, onError }: TeacherApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid resume file (PDF or Word document)');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Resume file size must be less than 10MB');
        return;
      }

      setResumeFile(file);
    }
  };

  const onSubmit = async (data: TeacherFormData) => {
    if (!imageFile || !resumeFile) {
      toast.error('Please upload both image and resume files');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof TeacherFormData]);
      });
      
      // Append files
      formData.append('image', imageFile);
      formData.append('resume', resumeFile);

      const response = await fetch('http://localhost:8000/api/teachers', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Teacher application submitted successfully!');
        reset();
        setImageFile(null);
        setResumeFile(null);
        setImagePreview(null);
        onSuccess?.(result.data);
      } else {
        const errorMessage = result.message || 'Failed to submit application';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Teacher Application Form</CardTitle>
        <CardDescription className="text-center">
          Please fill out all the required information and upload your documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <Alert>
                    <AlertDescription>{errors.name.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <Alert>
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  {...register('contactNumber')}
                  placeholder="Enter your contact number"
                />
                {errors.contactNumber && (
                  <Alert>
                    <AlertDescription>{errors.contactNumber.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setValue('gender', value as 'Male' | 'Female' | 'Other')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <Alert>
                    <AlertDescription>{errors.gender.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                />
                {errors.dateOfBirth && (
                  <Alert>
                    <AlertDescription>{errors.dateOfBirth.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="Enter your complete address"
                rows={3}
              />
              {errors.address && (
                <Alert>
                  <AlertDescription>{errors.address.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <Alert>
                    <AlertDescription>{errors.city.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Enter your state"
                />
                {errors.state && (
                  <Alert>
                    <AlertDescription>{errors.state.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Enter your country"
                />
                {errors.country && (
                  <Alert>
                    <AlertDescription>{errors.country.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  placeholder="Enter zip code"
                />
                {errors.zipCode && (
                  <Alert>
                    <AlertDescription>{errors.zipCode.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  {...register('qualification')}
                  placeholder="e.g., Master's in English Literature"
                />
                {errors.qualification && (
                  <Alert>
                    <AlertDescription>{errors.qualification.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  {...register('subject')}
                  placeholder="e.g., English Literature"
                />
                {errors.subject && (
                  <Alert>
                    <AlertDescription>{errors.subject.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertAt">Expert At *</Label>
                <Input
                  id="expertAt"
                  {...register('expertAt')}
                  placeholder="e.g., IELTS preparation, Academic writing"
                />
                {errors.expertAt && (
                  <Alert>
                    <AlertDescription>{errors.expertAt.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliedFor">Applied For *</Label>
                <Select onValueChange={(value) => setValue('appliedFor', value as 'IELTS' | 'English' | 'Quran')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Quran">Quran</SelectItem>
                  </SelectContent>
                </Select>
                {errors.appliedFor && (
                  <Alert>
                    <AlertDescription>{errors.appliedFor.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyFitForJob">Why You Fit For This Job *</Label>
              <Textarea
                id="whyFitForJob"
                {...register('whyFitForJob')}
                placeholder="Explain why you are the best candidate for this position..."
                rows={4}
              />
              {errors.whyFitForJob && (
                <Alert>
                  <AlertDescription>{errors.whyFitForJob.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="space-y-4">
                <Label htmlFor="image">Profile Image *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <Label htmlFor="resume">Resume/CV *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to upload resume'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !imageFile || !resumeFile}
              className="w-full max-w-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 