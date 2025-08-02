// Mock data for admin dashboard demonstration

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  duration: string;
  tutor: string;
  enrollments: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'pending';
}

export interface Teacher {
  id: string;
  name: string;
  expertise: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  coursesCount: number;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with React, Node.js, and MongoDB.',
    category: 'Web Development',
    price: 199,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    duration: '12 weeks',
    tutor: 'John Smith',
    enrollments: 156,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Digital Marketing Mastery',
    description: 'Master social media marketing, SEO, and digital advertising strategies.',
    category: 'Marketing',
    price: 149,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    duration: '8 weeks',
    tutor: 'Sarah Johnson',
    enrollments: 89,
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    title: 'Python Programming for Beginners',
    description: 'Start your programming journey with Python - from basics to advanced concepts.',
    category: 'Programming',
    price: 129,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    duration: '10 weeks',
    tutor: 'Mike Chen',
    enrollments: 234,
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'Graphic Design Fundamentals',
    description: 'Learn design principles, typography, and create stunning visuals with industry tools.',
    category: 'Design',
    price: 179,
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop',
    duration: '6 weeks',
    tutor: 'Emily Davis',
    enrollments: 67,
    createdAt: '2024-02-10'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentName: 'Alex Rodriguez',
    studentEmail: 'alex@email.com',
    courseName: 'Complete Web Development Bootcamp',
    enrolledAt: '2024-03-01',
    status: 'active'
  },
  {
    id: '2',
    studentName: 'Maria Garcia',
    studentEmail: 'maria@email.com',
    courseName: 'Digital Marketing Mastery',
    enrolledAt: '2024-02-28',
    status: 'completed'
  },
  {
    id: '3',
    studentName: 'David Wilson',
    studentEmail: 'david@email.com',
    courseName: 'Python Programming for Beginners',
    enrolledAt: '2024-03-05',
    status: 'active'
  },
  {
    id: '4',
    studentName: 'Lisa Thompson',
    studentEmail: 'lisa@email.com',
    courseName: 'Graphic Design Fundamentals',
    enrolledAt: '2024-03-03',
    status: 'pending'
  },
  {
    id: '5',
    studentName: 'James Brown',
    studentEmail: 'james@email.com',
    courseName: 'Complete Web Development Bootcamp',
    enrolledAt: '2024-02-25',
    status: 'active'
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'John Smith',
    expertise: 'Full-Stack Development',
    email: 'john.smith@digitaltutorclub.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior developer with 8+ years of experience in web technologies.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coursesCount: 3
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    expertise: 'Digital Marketing',
    email: 'sarah.johnson@digitaltutorclub.com',
    phone: '+1 (555) 234-5678',
    bio: 'Marketing expert with proven track record in growing online businesses.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b332b025?w=150&h=150&fit=crop&crop=face',
    coursesCount: 2
  },
  {
    id: '3',
    name: 'Mike Chen',
    expertise: 'Python & Data Science',
    email: 'mike.chen@digitaltutorclub.com',
    phone: '+1 (555) 345-6789',
    bio: 'Data scientist and Python developer with expertise in machine learning.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coursesCount: 4
  },
  {
    id: '4',
    name: 'Emily Davis',
    expertise: 'Graphic Design',
    email: 'emily.davis@digitaltutorclub.com',
    phone: '+1 (555) 456-7890',
    bio: 'Creative designer with 6+ years of experience in branding and UI/UX.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    coursesCount: 2
  }
];