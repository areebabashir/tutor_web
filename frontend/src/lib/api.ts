// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  TEACHERS: `${API_BASE_URL}/teachers`,
  STUDENTS: `${API_BASE_URL}/students`,
  COURSES: `${API_BASE_URL}/courses`,
  VIDEOS: `${API_BASE_URL}/videos`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  QUIZZES: `${API_BASE_URL}/quizzes`,
  BLOGS: `${API_BASE_URL}/blogs`,
  COMMENTS: `${API_BASE_URL}/comments`,
  CONTACTS: `${API_BASE_URL}/contacts`,
  NOTES: `${API_BASE_URL}/notes`,
};





// API utility functions
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Remove Content-Type for FormData requests
  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  }


  try {
    const response = await fetch(endpoint, defaultOptions);
    
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Request URL:', endpoint);
    console.error('Request options:', defaultOptions);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Connection failed. Please check if the server is running on ${endpoint.split('/api')[0]}`);
    }
    
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Admin login
  adminLogin: async (credentials: { email: string; password: string }) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/admin-login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // User login
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // User registration
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    answer: string;
  }) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Verify token for persistent sessions
  verifyToken: async (token: string) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/verify-token`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Logout
  logout: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/logout`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Forgot password
  forgotPassword: async (data: { email: string; answer: string; newPassword: string }) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/ForgetPassword`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update profile
  updateProfile: async (profileData: {
    name?: string;
    email?: string;
    password?: string;
    address?: string;
    phone?: string;
  }) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Test protected route
  testAuth: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/test`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // User auth check
  userAuth: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/user-auth`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Admin auth check
  adminAuth: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.AUTH}/admin-auth`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Teacher API functions
export const teacherAPI = {
  // Submit teacher application
  submitApplication: async (formData: FormData) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/add`, {
      method: 'POST',
      body: formData,
    });
  },

  // Get all teachers (admin only)
  getAllTeachers: async (authorization: string) => {
    return apiRequest(API_ENDPOINTS.TEACHERS + '/getall', {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get teacher by ID (admin only)
  getTeacherById: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/get/${id}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Update teacher (admin only)
  updateTeacher: async (id: string, formData: FormData, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/update/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Delete teacher (admin only)
  deleteTeacher: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Search teachers (admin only)
  searchTeachers: async (query: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get teachers by subject (admin only)
  getTeachersBySubject: async (subject: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.TEACHERS}/subject/${encodeURIComponent(subject)}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Contact API functions
export const contactAPI = {
  submitContact: async (contactData: {
    fullName: string;
    emailAddress: string;
    subject: string;
    message: string;
  }) => {
    return apiRequest(API_ENDPOINTS.CONTACTS, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Get all contacts (admin only)
  getAllContacts: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.CONTACTS}/getAll`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get contact by ID (admin only)
  getContactById: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.CONTACTS}/get/${id}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Delete contact (admin only)
  deleteContact: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.CONTACTS}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Course API functions
export const courseAPI = {
  // Get all courses (public)
  getAllCourses: async (params?: {
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
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COURSES}/getall${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get course by ID (public)
  getCourseById: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.COURSES}/get/${id}`);
  },

  // Create course (admin only)
  createCourse: async (courseData: FormData | {
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
    status?: 'active' | 'inactive' | 'upcoming';
    level?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    requirements?: string[];
    learningOutcomes?: string[];
  }, authorization: string) => {
    const isFormData = courseData instanceof FormData;
    return apiRequest(`${API_ENDPOINTS.COURSES}/create`, {
      method: 'POST',
      body: isFormData ? courseData : JSON.stringify(courseData),
      headers: isFormData ? {
        Authorization: authorization,
      } : {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Update course (admin only)
  updateCourse: async (id: string, courseData: FormData | any, authorization: string) => {
    const isFormData = courseData instanceof FormData;
    return apiRequest(`${API_ENDPOINTS.COURSES}/update/${id}`, {
      method: 'PUT',
      body: isFormData ? courseData : JSON.stringify(courseData),
      headers: isFormData ? {
        Authorization: authorization,
      } : {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Delete course (admin only)
  deleteCourse: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.COURSES}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get courses by category (public)
  getCoursesByCategory: async (category: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COURSES}/category/${encodeURIComponent(category)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get courses by instructor (public)
  getCoursesByInstructor: async (instructorName: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COURSES}/instructor/${encodeURIComponent(instructorName)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Search courses (public)
  searchCourses: async (query: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COURSES}/search?${queryParams.toString()}`;
    return apiRequest(url);
  },

  // Get course statistics (public)
  getCourseStats: async () => {
    return apiRequest(`${API_ENDPOINTS.COURSES}/stats`);
  },
};

// Student API functions
export const studentAPI = {
  // Submit student enrollment
  submitEnrollment: async (formData: FormData) => {
    return apiRequest(API_ENDPOINTS.STUDENTS, {
      method: 'POST',
      body: formData,
    });
  },

  // Get all students (admin only)
  getAllStudents: async (authorization: string) => {
    return apiRequest(API_ENDPOINTS.STUDENTS, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get student by ID (admin only)
  getStudentById: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.STUDENTS}/${id}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Update student (admin only)
  updateStudent: async (id: string, formData: FormData, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.STUDENTS}/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Delete student (admin only)
  deleteStudent: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.STUDENTS}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Search students (admin only)
  searchStudents: async (query: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.STUDENTS}/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get students by course (admin only)
  getStudentsByCourse: async (courseId: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.STUDENTS}/course/${encodeURIComponent(courseId)}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Video API functions
export const videoAPI = {
  // Upload video (admin only)
  uploadVideo: async (formData: FormData, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.VIDEOS}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get all videos (admin only)
  getAllVideos: async (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }, authorization?: string) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.VIDEOS}/getall${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const options: RequestInit = {};
    
    if (authorization) {
      options.headers = {
        Authorization: authorization,
      };
    }
    
    return apiRequest(url, options);
  },

  // Get video by ID (public)
  getVideoById: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.VIDEOS}/get/${id}`);
  },

  // Update video (admin only)
  updateVideo: async (id: string, videoData: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    status?: 'active' | 'inactive' | 'processing';
    isPublic?: boolean;
  }, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.VIDEOS}/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Delete video (admin only)
  deleteVideo: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.VIDEOS}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get videos by category (public)
  getVideosByCategory: async (category: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.VIDEOS}/category/${encodeURIComponent(category)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Search videos (public)
  searchVideos: async (query: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.VIDEOS}/search?${queryParams.toString()}`;
    return apiRequest(url);
  },

  // Get video statistics (public)
  getVideoStats: async () => {
    return apiRequest(`${API_ENDPOINTS.VIDEOS}/stats`);
  },
};

// Review API functions
export const reviewAPI = {
  // Get all reviews (admin only)
  getAllReviews: async (authorization: string, params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.REVIEWS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get public reviews (for frontend display)
  getPublicReviews: async (params?: {
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.REVIEWS}/public${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Create review (admin only)
  createReview: async (reviewData: {
    name: string;
    image?: string;
    review: string;
  }, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Get review by ID (admin only)
  getReviewById: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}/${id}`, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Update review (admin only)
  updateReview: async (id: string, reviewData: {
    name?: string;
    image?: string;
    review?: string;
    status?: 'active' | 'inactive';
  }, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Delete review (admin only)
  deleteReview: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Upload review image (admin only)
  uploadReviewImage: async (formData: FormData, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get review statistics (admin only)
  getReviewStats: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.REVIEWS}/stats`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Blog API functions
export const blogAPI = {
  // Get all blogs (admin only)
  getAllBlogs: async (authorization?: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    exclude?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.BLOGS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const options: RequestInit = {};
    
    if (authorization) {
      options.headers = {
        Authorization: authorization,
      };
    }
    
    return apiRequest(url, options);
  },

  // Get published blogs (public)
  getPublishedBlogs: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.BLOGS}/published${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get blog by ID
  getBlogById: async (id: string, authorization: string) => {
    const url = `${API_ENDPOINTS.BLOGS}/${id}`;
    return apiRequest(url, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get blog by slug (public)
  getBlogBySlug: async (slug: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/slug/${slug}`);
  },

  // Toggle like on blog
  toggleBlogLike: async (blogId: string, userEmail: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/${blogId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    });
  },

  // Create blog (admin only)
  createBlog: async (blogData: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags?: string;
    author?: string;
    status?: string;
    featuredImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    allowComments?: boolean;
  }, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}`, {
      method: 'POST',
      body: JSON.stringify(blogData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Update blog (admin only)
  updateBlog: async (id: string, blogData: any, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Upload blog image (admin only)
  uploadBlogImage: async (formData: FormData, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Delete blog (admin only)
  deleteBlog: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get blog statistics (admin only)
  getBlogStats: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.BLOGS}/stats`, {
      headers: {
        Authorization: authorization,
      },
    });
  }
};

// Quiz API functions
export const quizAPI = {
  // Get all quizzes (admin only)
  getAllQuizzes: async (authorization: string, params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    category?: string;
    difficulty?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);

    const url = `${API_ENDPOINTS.QUIZZES}?${searchParams.toString()}`;
    return apiRequest(url, {
      headers: { Authorization: authorization }
    });
  },

  // Get all quiz results across all quizzes (admin only) - for dashboard
  getAllQuizResults: async (authorization: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `${API_ENDPOINTS.QUIZZES}/all-results?${searchParams.toString()}`;
    return apiRequest(url, {
      headers: { Authorization: authorization }
    });
  },

  // Get active quizzes (for students)
  getActiveQuizzes: async (params?: {
    category?: string;
    difficulty?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.QUIZZES}/active${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get quiz by ID
  getQuizById: async (id: string, includeAnswers?: boolean) => {
    const url = `${API_ENDPOINTS.QUIZZES}/${id}${includeAnswers ? '?includeAnswers=true' : ''}`;
    return apiRequest(url);
  },

  // Create quiz (admin only)
  createQuiz: async (quizData: {
    title: string;
    description: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
    passingScore?: number;
    timeLimit?: number;
    category?: string;
    difficulty?: string;
  }, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.QUIZZES}`, {
      method: 'POST',
      body: JSON.stringify(quizData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Update quiz (admin only)
  updateQuiz: async (id: string, quizData: any, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.QUIZZES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
  },

  // Delete quiz (admin only)
  deleteQuiz: async (id: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.QUIZZES}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Submit quiz result (student)
  submitQuizResult: async (quizId: string, resultData: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    answers: number[];
    timeTaken: number;
  }) => {
    return apiRequest(`${API_ENDPOINTS.QUIZZES}/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(resultData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Get quiz results (admin only)
  getQuizResults: async (quizId: string, authorization: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.QUIZZES}/${quizId}/results${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get quiz statistics (admin only)
  getQuizStats: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.QUIZZES}/stats`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
};

// Comment API functions
export const commentAPI = {
  // Create a new comment
  createComment: async (commentData: {
    blogId: string;
    content: string;
    parentCommentId?: string;
    author: {
      name: string;
      email: string;
      avatar?: string;
    };
  }) => {
    return apiRequest(`${API_ENDPOINTS.COMMENTS}/create`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // Get comments for a blog
  getBlogComments: async (blogId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COMMENTS}/blog/${blogId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Toggle like on a comment
  toggleLike: async (commentId: string, userEmail: string) => {
    return apiRequest(`${API_ENDPOINTS.COMMENTS}/${commentId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    });
  },

  // Get all comments (admin only)
  getAllComments: async (authorization: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    blogId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COMMENTS}/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url, {
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Update comment status (admin only)
  updateCommentStatus: async (commentId: string, status: 'pending' | 'approved' | 'rejected', authorization: string) => {
    const url = `${API_ENDPOINTS.COMMENTS}/admin/${commentId}/status`;
    const requestBody = { status };
    const options = {
      method: 'PUT',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    };
    
    try {
      const response = await apiRequest(url, options);
      return response;
    } catch (error) {
      console.error('API error in updateCommentStatus:', error);
      throw error;
    }
  },

  // Delete comment (admin only)
  deleteComment: async (commentId: string, authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.COMMENTS}/admin/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });
  },

  // Get comment statistics (admin only)
  getCommentStats: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.COMMENTS}/admin/stats`, {
      headers: {
        Authorization: authorization,
      },
    });
  },
}; 

// Notes API functions
export const notesAPI = {
  // Get all notes (admin)
  getAllNotes: async (authorization: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.status) searchParams.append('status', params.status);

    const url = `${API_ENDPOINTS.NOTES}?${searchParams.toString()}`;
    return apiRequest(url, {
      headers: { Authorization: authorization }
    });
  },

  // Get public notes (frontend)
  getPublicNotes: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);

    const url = `${API_ENDPOINTS.NOTES}/public?${searchParams.toString()}`;
    return apiRequest(url);
  },

  // Get single notes by ID
  getNotesById: async (id: string, authorization?: string) => {
    const url = authorization 
      ? `${API_ENDPOINTS.NOTES}/${id}`
      : `${API_ENDPOINTS.NOTES}/public/${id}`;
    
    const options: RequestInit = {};
    if (authorization) {
      options.headers = { Authorization: authorization };
    }
    
    return apiRequest(url, options);
  },

  // Create new notes
  createNotes: async (authorization: string, formData: FormData) => {
    return apiRequest(API_ENDPOINTS.NOTES, {
      method: 'POST',
      headers: { Authorization: authorization },
      body: formData,
    });
  },

  // Update notes
  updateNotes: async (authorization: string, id: string, formData: FormData) => {
    return apiRequest(`${API_ENDPOINTS.NOTES}/${id}`, {
      method: 'PUT',
      headers: { Authorization: authorization },
      body: formData,
    });
  },

  // Delete notes
  deleteNotes: async (authorization: string, id: string) => {
    return apiRequest(`${API_ENDPOINTS.NOTES}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: authorization }
    });
  },

  // Download notes
  downloadNotes: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.NOTES}/download/${id}`, {
      method: 'POST'
    });
  },

  // Get notes statistics
  getNotesStats: async (authorization: string) => {
    return apiRequest(`${API_ENDPOINTS.NOTES}/stats`, {
      headers: { Authorization: authorization }
    });
  },
}; 