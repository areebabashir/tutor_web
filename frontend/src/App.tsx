import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TeacherApplicationPage from "./pages/TeacherApplication";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminTeachers from "./pages/admin/Teachers";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminContactPage from "./pages/admin/AdminContactPage";
import AdminCommentsPage from "./pages/admin/Comments";
import AdminNotes from "./pages/admin/Notes";
import AdminQuizzesPage from "./pages/admin/Quizzes";
import AdminBlogsPage from "./pages/admin/Blogs";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

import StudentEnrollmentPage from "./pages/StudentEnrollmentPage";
import QuizzesPage from "./pages/Quizzes";
import BlogPage from "./pages/BlogPage";
import BlogView from "./pages/BlogView";
import NotesPage from "./pages/Notes";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply-teacher" element={<TeacherApplicationPage />} />
              <Route path="/enroll-course" element={<StudentEnrollmentPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogView />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="enrollments" element={<AdminEnrollments />} />
                <Route path="teachers" element={<AdminTeachers />} />
                <Route path="reviews" element={<AdminReviewsPage/>} />
                <Route path="contact" element={<AdminContactPage />} />
                <Route path="quizzes" element={<AdminQuizzesPage />} />
                <Route path="blogs" element={<AdminBlogsPage />} />
                <Route path="comments" element={<AdminCommentsPage />} />
                <Route path="notes" element={<AdminNotes />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
