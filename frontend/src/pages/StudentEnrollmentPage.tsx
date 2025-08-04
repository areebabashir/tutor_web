'use client';

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudentEnrollmentForm from '@/components/StudentEnrollmentForm';
import { Toaster } from 'sonner';

export default function StudentEnrollmentPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Enroll as a Student</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to start your learning journey? Enroll now by filling out the form below.
              {courseId && <span className="block text-sm text-blue-600 mt-2">Course has been pre-selected for you!</span>}
            </p>
          </section>

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
