# Teacher API Integration

This document explains the integration between the frontend teacher application form and the backend API.

## Backend API Endpoints

### Teacher Routes (`/api/teachers`)

1. **POST `/api/teachers`** - Submit teacher application (Public)
   - Accepts multipart form data with image and resume files
   - Required fields: name, email, contactNumber, address, city, country, state, zipCode, gender, dateOfBirth, qualification, subject, expertAt, appliedFor, whyFitForJob
   - Required files: image, resume

2. **POST `/api/teachers/add`** - Add teacher (Admin only)
   - Same as above but requires admin authentication

3. **GET `/api/teachers/getall`** - Get all teachers (Admin only)
   - Requires admin authentication

4. **GET `/api/teachers/get/:id`** - Get teacher by ID (Admin only)
   - Requires admin authentication

5. **PUT `/api/teachers/update/:id`** - Update teacher (Admin only)
   - Requires admin authentication
   - Accepts multipart form data

6. **DELETE `/api/teachers/:id`** - Delete teacher (Admin only)
   - Requires admin authentication

7. **GET `/api/teachers/search`** - Search teachers (Admin only)
   - Query parameter: `q` (search query)
   - Requires admin authentication

8. **GET `/api/teachers/subject/:appliedFor`** - Get teachers by subject (Admin only)
   - Requires admin authentication

### Contact Routes (`/api/contacts`)

1. **POST `/api/contacts/get/add`** - Submit contact form (Public)
   - Accepts JSON data
   - Required fields: fullName, emailAddress, subject, message

2. **GET `/api/contacts/getAll`** - Get all contacts (Admin only)
   - Requires admin authentication

3. **GET `/api/contacts/get/:id`** - Get contact by ID (Admin only)
   - Requires admin authentication

4. **DELETE `/api/contacts/delete/:id`** - Delete contact (Admin only)
   - Requires admin authentication

### Course Routes (`/api/courses`)

1. **GET `/api/courses/getall`** - Get all courses (Public)
   - Query parameters: category, status, level, instructor, search, page, limit, sortBy, sortOrder
   - Supports filtering, pagination, and sorting

2. **GET `/api/courses/get/:id`** - Get course by ID (Public)
   - Returns detailed course information

3. **POST `/api/courses/create`** - Create course (Admin only)
   - Requires admin authentication
   - Required fields: title, description, category, video, image, syllabus, instructorName, duration
   - Optional fields: features, status, level, tags, requirements, learningOutcomes

4. **PUT `/api/courses/update/:id`** - Update course (Admin only)
   - Requires admin authentication
   - Accepts all course fields for update

5. **DELETE `/api/courses/delete/:id`** - Delete course (Admin only)
   - Requires admin authentication

6. **GET `/api/courses/category/:category`** - Get courses by category (Public)
   - Query parameters: page, limit
   - Categories: IELTS, English Proficiency, Quran

7. **GET `/api/courses/instructor/:instructorName`** - Get courses by instructor (Public)
   - Query parameters: page, limit

8. **GET `/api/courses/search`** - Search courses (Public)
   - Query parameter: q (search query)
   - Searches in title, description, instructor name, category, and tags

9. **GET `/api/courses/stats`** - Get course statistics (Public)
   - Returns overall stats, category stats, and level stats

### Video Routes (`/api/videos`)

1. **POST `/api/videos/upload`** - Upload video (Admin only)
   - Accepts multipart form data with video file
   - Required fields: title, description, category
   - Optional fields: tags
   - File size limit: 100MB
   - Supported formats: MP4, AVI, MOV, WMV, FLV, WebM, MKV

2. **GET `/api/videos/getall`** - Get all videos (Public/Admin)
   - Query parameters: category, status, search, page, limit, sortBy, sortOrder
   - Supports filtering, pagination, and sorting

3. **GET `/api/videos/get/:id`** - Get video by ID (Public)
   - Returns detailed video information with metadata

4. **PUT `/api/videos/update/:id`** - Update video (Admin only)
   - Requires admin authentication
   - Accepts video metadata updates (no file upload)

5. **DELETE `/api/videos/delete/:id`** - Delete video (Admin only)
   - Requires admin authentication
   - Deletes both database record and file from filesystem

6. **GET `/api/videos/category/:category`** - Get videos by category (Public)
   - Query parameters: page, limit
   - Categories: IELTS, English Proficiency, Quran, General

7. **GET `/api/videos/search`** - Search videos (Public)
   - Query parameter: q (search query)
   - Searches in title, description, category, and tags

8. **GET `/api/videos/stats`** - Get video statistics (Public)
   - Returns overall stats, category stats, and file size statistics

## Frontend Integration

### API Configuration (`src/lib/api.ts`)

The frontend uses a centralized API configuration with the following features:

- Environment-based API URL configuration
- Centralized error handling
- Authentication token management
- FormData support for file uploads

### Teacher Application Form (`src/components/TeacherApplicationForm.tsx`)

The form integrates with the backend API using:

1. **Form Validation**: Uses Zod schema validation
2. **File Upload**: Handles image and resume file uploads with validation
3. **API Integration**: Uses the centralized `teacherAPI.submitApplication()` function
4. **Error Handling**: Comprehensive error handling with toast notifications
5. **Success Handling**: Form reset and success callbacks

### Admin Teachers Page (`src/pages/admin/Teachers.tsx`)

The admin page provides:

1. **Teacher Management**: View, search, filter, and delete teacher applications
2. **API Integration**: Uses centralized API functions for all operations
3. **Authentication**: Requires admin authentication for all operations
4. **Real-time Updates**: Refreshes data after operations

### Contact Form (`src/pages/Contact.tsx`)

The contact form integrates with the backend API using:

1. **Form Validation**: Client-side validation for all required fields
2. **API Integration**: Uses the centralized `contactAPI.submitContact()` function
3. **Error Handling**: Comprehensive error handling with toast notifications
4. **Success Handling**: Form reset and success callbacks
5. **Loading States**: Shows loading spinner during submission

### Admin Contact Page (`src/pages/admin/AdminContactPage.tsx`)

The admin contact page provides:

1. **Contact Management**: View and delete contact messages
2. **API Integration**: Uses centralized API functions for all operations
3. **Authentication**: Requires admin authentication for all operations
4. **Message Details**: View full message details in a modal
5. **Email Integration**: Direct reply via email functionality

### Course Management (`src/lib/api.ts`)

The course API provides comprehensive course management with:

1. **Public Access**: Get all courses, search, filter by category/instructor
2. **Admin Management**: Create, update, delete courses with authentication
3. **Advanced Filtering**: Filter by category, status, level, instructor
4. **Search Functionality**: Search across title, description, instructor, category, tags
5. **Pagination**: Built-in pagination support for large datasets
6. **Statistics**: Course statistics and analytics

### Video Management (`src/lib/api.ts`)

The video API provides comprehensive video management with:

1. **Video Upload**: Secure file upload with validation and size limits
2. **Admin Management**: Upload, update, delete videos with authentication
3. **Metadata Management**: Track video information, duration, file size
4. **Category Organization**: Organize videos by course categories
5. **Search & Filter**: Search videos by title, description, category, tags
6. **Statistics**: Video analytics and usage statistics

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Development Configuration
VITE_APP_NAME=Tutor Web Application
VITE_APP_VERSION=1.0.0
```

## Usage Examples

### Submit Teacher Application

```typescript
import { teacherAPI } from '../lib/api';

const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
// ... other fields
formData.append('image', imageFile);
formData.append('resume', resumeFile);

try {
  const result = await teacherAPI.submitApplication(formData);
  console.log('Application submitted:', result.data);
} catch (error) {
  console.error('Submission failed:', error.message);
}
```

### Get All Teachers (Admin)

```typescript
import { teacherAPI } from '../lib/api';

try {
  const result = await teacherAPI.getAllTeachers(adminToken);
  console.log('Teachers:', result.data);
} catch (error) {
  console.error('Failed to fetch teachers:', error.message);
}
```

### Submit Contact Form

```typescript
import { contactAPI } from '../lib/api';

const contactData = {
  fullName: 'John Doe',
  emailAddress: 'john@example.com',
  subject: 'General Inquiry',
  message: 'I have a question about your courses.'
};

try {
  const result = await contactAPI.submitContact(contactData);
  console.log('Contact submitted:', result);
} catch (error) {
  console.error('Contact submission failed:', error.message);
}
```

### Get All Contacts (Admin)

```typescript
import { contactAPI } from '../lib/api';

try {
  const result = await contactAPI.getAllContacts(adminToken);
  console.log('Contacts:', result);
} catch (error) {
  console.error('Failed to fetch contacts:', error.message);
}
```

### Create Course (Admin)

```typescript
import { courseAPI } from '../lib/api';

const courseData = {
  title: 'IELTS Preparation Course',
  description: 'Comprehensive IELTS preparation course covering all four modules',
  category: 'IELTS',
  video: 'https://example.com/course-video.mp4',
  image: 'https://example.com/course-image.jpg',
  syllabus: 'Week 1: Introduction to IELTS...',
  features: ['Live sessions', 'Practice tests', 'One-on-one feedback'],
  duration: {
    startDate: '2024-02-01',
    endDate: '2024-04-01'
  },
  instructorName: 'John Smith',
  status: 'upcoming',
  level: 'intermediate',
  tags: ['IELTS', 'English', 'Exam preparation'],
  requirements: ['Basic English knowledge', 'Computer with internet'],
  learningOutcomes: ['Achieve 7+ band score', 'Master all four modules']
};

try {
  const result = await courseAPI.createCourse(courseData, adminToken);
  console.log('Course created:', result.data);
} catch (error) {
  console.error('Course creation failed:', error.message);
}
```

### Get All Courses (Public)

```typescript
import { courseAPI } from '../lib/api';

try {
  const result = await courseAPI.getAllCourses({
    category: 'IELTS',
    status: 'active',
    page: 1,
    limit: 10
  });
  console.log('Courses:', result.data);
} catch (error) {
  console.error('Failed to fetch courses:', error.message);
}
```

### Search Courses (Public)

```typescript
import { courseAPI } from '../lib/api';

try {
  const result = await courseAPI.searchCourses('IELTS', {
    page: 1,
    limit: 10
  });
  console.log('Search results:', result.data);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

### Upload Video (Admin)

```typescript
import { videoAPI } from '../lib/api';

const formData = new FormData();
formData.append('video', videoFile);
formData.append('title', 'IELTS Speaking Practice');
formData.append('description', 'Practice IELTS speaking with sample questions');
formData.append('category', 'IELTS');
formData.append('tags', 'speaking, practice, IELTS');

try {
  const result = await videoAPI.uploadVideo(formData, adminToken);
  console.log('Video uploaded:', result.data);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

### Get All Videos (Admin)

```typescript
import { videoAPI } from '../lib/api';

try {
  const result = await videoAPI.getAllVideos({
    category: 'IELTS',
    status: 'active',
    page: 1,
    limit: 10
  }, adminToken);
  console.log('Videos:', result.data);
} catch (error) {
  console.error('Failed to fetch videos:', error.message);
}
```

### Update Video (Admin)

```typescript
import { videoAPI } from '../lib/api';

const videoData = {
  title: 'Updated IELTS Speaking Practice',
  description: 'Updated description for IELTS speaking practice',
  category: 'IELTS',
  tags: 'speaking, practice, IELTS, updated',
  status: 'active',
  isPublic: true
};

try {
  const result = await videoAPI.updateVideo(videoId, videoData, adminToken);
  console.log('Video updated:', result.data);
} catch (error) {
  console.error('Update failed:', error.message);
}
```

### Delete Video (Admin)

```typescript
import { videoAPI } from '../lib/api';

try {
  await videoAPI.deleteVideo(videoId, adminToken);
  console.log('Video deleted successfully');
} catch (error) {
  console.error('Delete failed:', error.message);
}
```

## File Upload Requirements

### Image File
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Maximum size: 5MB
- Field name: `image`

### Resume File
- Allowed formats: PDF, DOC, DOCX
- Maximum size: 10MB
- Field name: `resume`

### Video File
- Allowed formats: MP4, AVI, MOV, WMV, FLV, WebM, MKV
- Maximum size: 100MB
- Field name: `video`
- Supported codecs: H.264, H.265, VP9, AV1

## Error Handling

The API integration includes comprehensive error handling:

1. **Network Errors**: Handled with user-friendly messages
2. **Validation Errors**: Displayed as toast notifications
3. **Server Errors**: Proper error messages from backend
4. **File Upload Errors**: Size and format validation

## Security Features

1. **Admin Authentication**: All admin operations require valid JWT tokens
2. **File Validation**: Server-side file type and size validation
3. **Input Validation**: Both client-side and server-side validation
4. **CORS Configuration**: Proper CORS setup for cross-origin requests 