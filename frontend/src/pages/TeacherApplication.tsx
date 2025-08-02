import React from 'react';
import { TeacherApplicationForm } from '../components/TeacherApplicationForm';
import { Toaster } from 'sonner';

export function TeacherApplicationPage() {
  const handleSuccess = (data: any) => {
    console.log('Application submitted successfully:', data);
  };

  const handleError = (error: string) => {
    console.error('Application submission failed:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Teaching Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're looking for passionate educators to join our team. Whether you specialize in IELTS preparation, 
            English language teaching, or Quranic studies, we want to hear from you.
          </p>
        </div>

        <TeacherApplicationForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Teaching</h3>
              <p className="text-gray-600">
                Teach from anywhere with our online platform and flexible scheduling options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supportive Community</h3>
              <p className="text-gray-600">
                Join a community of dedicated educators with ongoing training and support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                Advance your career with professional development and leadership opportunities.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Available Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IELTS Instructor</h3>
              <p className="text-gray-600 mb-4">
                Help students prepare for IELTS exams with comprehensive training and practice materials.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• IELTS certification preferred</li>
                <li>• Experience with test preparation</li>
                <li>• Strong communication skills</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">English Teacher</h3>
              <p className="text-gray-600 mb-4">
                Teach English language skills to students of all levels and backgrounds.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• TEFL/TESOL certification</li>
                <li>• Experience teaching English</li>
                <li>• Patient and encouraging approach</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quran Teacher</h3>
              <p className="text-gray-600 mb-4">
                Guide students in Quranic studies, Tajweed, and Islamic education.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Strong Quranic knowledge</li>
                <li>• Tajweed certification</li>
                <li>• Experience teaching Islamic studies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default TeacherApplicationPage; 