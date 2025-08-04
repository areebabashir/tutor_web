import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  GraduationCap, 
  User, 
  MapPin, 
  Briefcase,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { teacherAPI } from '@/lib/api';

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

      const result = await teacherAPI.submitApplication(formData);

      toast.success('Teacher application submitted successfully!');
      reset();
      setImageFile(null);
      setResumeFile(null);
      setImagePreview(null);
      onSuccess?.(result.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-5xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <h1 className="text-3xl font-bold">Teacher Application</h1>
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
            <CardDescription className="text-white/90 text-lg">
              Join our team of expert educators and inspire the next generation
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Full Name *</span>
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your full name"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.name && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.name.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Email Address *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email address"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.email && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.email.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="contactNumber" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Contact Number *</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      {...register('contactNumber')}
                      placeholder="Enter your contact number"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.contactNumber && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.contactNumber.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Gender *</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('gender', value as 'Male' | 'Female' | 'Other')}>
                      <SelectTrigger className="input-modern group-hover:shadow-lg transition-all duration-300">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.gender.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Date of Birth *</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.dateOfBirth && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.dateOfBirth.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Address Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3 group">
                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Full Address *</span>
                    </Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      placeholder="Enter your complete address"
                      rows={3}
                      className="input-modern group-hover:shadow-lg transition-all duration-300 resize-none"
                    />
                    {errors.address && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.address.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-3 group">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City *</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="Enter your city"
                        className="input-modern group-hover:shadow-lg transition-all duration-300"
                      />
                      {errors.city && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-700">{errors.city.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State/Province *</Label>
                      <Input
                        id="state"
                        {...register('state')}
                        placeholder="Enter your state"
                        className="input-modern group-hover:shadow-lg transition-all duration-300"
                      />
                      {errors.state && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-700">{errors.state.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country *</Label>
                      <Input
                        id="country"
                        {...register('country')}
                        placeholder="Enter your country"
                        className="input-modern group-hover:shadow-lg transition-all duration-300"
                      />
                      {errors.country && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-700">{errors.country.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-700">Zip/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode')}
                        placeholder="Enter zip code"
                        className="input-modern group-hover:shadow-lg transition-all duration-300"
                      />
                      {errors.zipCode && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-700">{errors.zipCode.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Professional Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>Qualification *</span>
                    </Label>
                    <Input
                      id="qualification"
                      {...register('qualification')}
                      placeholder="e.g., Master's in English Literature"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.qualification && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.qualification.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>Subject *</span>
                    </Label>
                    <Input
                      id="subject"
                      {...register('subject')}
                      placeholder="e.g., English Literature"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.subject && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.subject.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="expertAt" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>Expert At *</span>
                    </Label>
                    <Input
                      id="expertAt"
                      {...register('expertAt')}
                      placeholder="e.g., IELTS preparation, Academic writing"
                      className="input-modern group-hover:shadow-lg transition-all duration-300"
                    />
                    {errors.expertAt && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.expertAt.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="appliedFor" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>Applied For *</span>
                    </Label>
                    <Select onValueChange={(value) => setValue('appliedFor', value as 'IELTS' | 'English' | 'Quran')}>
                      <SelectTrigger className="input-modern group-hover:shadow-lg transition-all duration-300">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Quran">Quran</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.appliedFor && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{errors.appliedFor.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="whyFitForJob" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Why You Fit For This Job *</span>
                  </Label>
                  <Textarea
                    id="whyFitForJob"
                    {...register('whyFitForJob')}
                    placeholder="Explain why you are the best candidate for this position..."
                    rows={4}
                    className="input-modern group-hover:shadow-lg transition-all duration-300 resize-none"
                  />
                  {errors.whyFitForJob && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{errors.whyFitForJob.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Documents</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      <span>Profile Image *</span>
                    </Label>
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group cursor-pointer">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          {imageFile ? imageFile.name : 'Click to upload image'}
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="mt-4 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg mx-auto"
                        />
                      </div>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <Label htmlFor="resume" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span>Resume/CV *</span>
                    </Label>
                    <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          {resumeFile ? resumeFile.name : 'Click to upload resume'}
                        </p>
                        <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting || !imageFile || !resumeFile}
                  className="w-full max-w-md bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg font-semibold py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-3 h-5 w-5" />
                      Submit Application
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 