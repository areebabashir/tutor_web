import { useState, useEffect } from 'react';
import { courseAPI } from '@/lib/api';

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: 'IELTS' | 'English Proficiency' | 'Quran';
  video: string;
  image: string;
  syllabus: string;
  features?: string[];
  duration: {
    startDate: string;
    endDate: string;
  };
  instructorName: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  status: 'active' | 'inactive' | 'upcoming';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  requirements?: string[];
  learningOutcomes?: string[];
  durationInDays?: number;
  availableSpots?: number;
  enrollmentPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  data: Course[];
}

export const useCourses = (params?: {
  category?: string;
  status?: string;
  level?: string;
  instructor?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    count: 0
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: CoursesResponse = await courseAPI.getAllCourses(params);
      setCourses(response.data);
      setPagination({
        total: response.total,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        count: response.count
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [JSON.stringify(params)]);

  return {
    courses,
    loading,
    error,
    pagination,
    refetch: fetchCourses
  };
};

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse
  };
}; 