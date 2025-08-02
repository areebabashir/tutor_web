'use client';

import React, { useState } from 'react';
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
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const studentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  qualifications: z.string().min(2, 'Qualification must be at least 2 characters').max(100),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export default function StudentEnrollmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      console.log('Student enrollment data:', data);
      toast.success('Student enrollment submitted successfully!');
      reset();
    } catch {
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
              <Label htmlFor="qualifications">Qualifications *</Label>
              <Input
                id="qualifications"
                {...register('qualifications')}
                placeholder="e.g., Bachelor's Degree in Computer Science"
              />
              {errors.qualifications && (
                <Alert>
                  <AlertDescription>{errors.qualifications.message}</AlertDescription>
                </Alert>
              )}
            </div>
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
