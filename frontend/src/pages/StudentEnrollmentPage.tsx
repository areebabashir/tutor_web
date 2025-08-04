'use client';

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudentEnrollmentForm from '@/components/StudentEnrollmentForm';
import { Toaster } from 'sonner';
import { Users } from 'lucide-react';

export default function StudentEnrollmentPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

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
            <Users className="w-4 h-4 mr-2" />
            Start Learning
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Enroll as a Student
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Ready to start your learning journey? Enroll now by filling out the form below.
            {courseId && <span className="block text-sm text-white/80 mt-2">Course has been pre-selected for you!</span>}
          </p>
        </div>
      </section>

      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Form Section */}
          <section className="mb-16">
            <StudentEnrollmentForm preSelectedCourseId={courseId || undefined} />
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">Why Enroll With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: 'Expert Teachers',
                  desc: 'Learn from highly qualified and experienced instructors.',
                  color: 'bg-indigo-100 text-indigo-600',
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H7m5 0h5"
                    />
                  ),
                },
                {
                  title: 'Flexible Schedule',
                  desc: 'Choose timings that fit your routine for stress-free learning.',
                  color: 'bg-blue-100 text-blue-600',
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                },
                {
                  title: 'Career Boost',
                  desc: 'Gain valuable skills that enhance your future career path.',
                  color: 'bg-green-100 text-green-600',
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
                    className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}
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
        </div>
      </main>
      <Toaster position="top-right" />
      <Footer />
    </div>
  );
}
