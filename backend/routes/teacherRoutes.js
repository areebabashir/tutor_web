import express from 'express';
import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeachersBySubject,
    searchTeachers
} from '../controllers/teacherController.js';
import { uploadTeacherFiles, handleUploadError } from '../middleware/uploadMiddleware.js';
import { validateTeacher, handleValidationErrors } from '../middleware/teacherValidation.js';

const router = express.Router();

// Create a new teacher with file uploads
router.post('/',
    uploadTeacherFiles.fields([
        { name: 'image', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    handleUploadError,
    validateTeacher,
    handleValidationErrors,
    createTeacher
);

// Get all teachers
router.get('/getall', getAllTeachers);

// Get teacher by ID
router.get('/get/:id', getTeacherById);

// Update teacher with optional file uploads
router.put('/update/:id',
    uploadTeacherFiles.fields([
        { name: 'image', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    handleUploadError,
    validateTeacher,
    handleValidationErrors,
    updateTeacher
);

// Delete teacher
router.delete('/:id', deleteTeacher);

// Get teachers by applied subject
router.get('/subject/:appliedFor', getTeachersBySubject);

// Search teachers
router.get('/search', searchTeachers);

export default router; 