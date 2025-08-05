import React from 'react';
import { TeacherApplicationForm } from '../components/TeacherApplicationForm';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GraduationCap } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Send, Loader2, Sparkles, User, Mail, Phone, BookOpen, Award, Globe, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { teacherAPI } from "@/lib/api";
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function TeacherApplicationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const { handleError } = useErrorHandler();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    subjects: "",
    availability: "",
    motivation: "",
    references: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || !formData.education || !formData.experience || !formData.subjects || !formData.motivation) {
        handleError("Please fill in all required fields", {
          title: 'Validation Error',
          description: 'All required fields must be completed.',
          duration: 5000
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        handleError("Please enter a valid email address", {
          title: 'Invalid Email',
          description: 'The email format is not valid.',
          duration: 5000
        });
        return;
      }

      const applicationData = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        applicationData.append(key, value);
      });

      // Add resume file if selected
      if (selectedResume) {
        applicationData.append('resume', selectedResume);
      }

      await teacherAPI.submitApplication(applicationData);

      toast.success("Application submitted successfully! We'll review your application and get back to you within 3-5 business days.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        education: "",
        experience: "",
        subjects: "",
        availability: "",
        motivation: "",
        references: ""
      });
      setSelectedResume(null);
      
      // Navigate to thank you page or home
      navigate('/');
    } catch (error) {
      handleError(error, {
        title: 'Application Submission Failed',
        description: 'Unable to submit your application. Please try again later.',
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4 mr-2" />
            Join Our Team
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Join Our Teaching Team
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're looking for passionate educators to join our team. Whether you specialize in IELTS preparation,
            English language teaching, or Quranic studies, we want to hear from you.
          </p>
        </div>
      </section>

      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Application Form */}
          <section className="mb-16">
            <TeacherApplicationForm onSuccess={handleSuccess} onError={handleError} />
          </section>

          {/* Why Join Us */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">Why Join Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: 'Flexible Teaching',
                  desc: 'Teach from anywhere with our online platform and flexible scheduling options.',
                  iconColor: 'bg-blue-100 text-blue-600',
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  ),
                },
                {
                  title: 'Supportive Community',
                  desc: 'Join a community of dedicated educators with ongoing training and support.',
                  iconColor: 'bg-green-100 text-green-600',
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  ),
                },
                {
                  title: 'Growth Opportunities',
                  desc: 'Advance your career with professional development and leadership opportunities.',
                  iconColor: 'bg-purple-100 text-purple-600',
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div
                    className={`w-12 h-12 ${item.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.svg}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Available Positions */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">Available Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: 'IELTS Instructor',
                  desc: 'Help students prepare for IELTS exams with comprehensive training and practice materials.',
                  border: 'border-blue-500',
                  points: [
                    'IELTS certification preferred',
                    'Experience with test preparation',
                    'Strong communication skills',
                  ],
                },
                {
                  title: 'English Teacher',
                  desc: 'Teach English language skills to students of all levels and backgrounds.',
                  border: 'border-green-500',
                  points: [
                    'TEFL/TESOL certification',
                    'Experience teaching English',
                    'Patient and encouraging approach',
                  ],
                },
                {
                  title: 'Quran Teacher',
                  desc: 'Guide students in Quranic studies, Tajweed, and Islamic education.',
                  border: 'border-purple-500',
                  points: [
                    'Strong Quranic knowledge',
                    'Tajweed certification',
                    'Experience teaching Islamic studies',
                  ],
                },
              ].map((role, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${role.border}`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 mb-4">{role.desc}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {role.points.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Toaster position="top-right" />
      <Footer />
    </div>
  );
}

export default TeacherApplicationPage;
