import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories if they don't exist
const createUploadDirs = () => {
    const uploadDir = './uploads';
    const imageDir = './uploads/images';
    const resumeDir = './uploads/resumes';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }
    if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
    }
};

// Call the function to create directories
createUploadDirs();

// Configure storage for images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/resumes');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                    file.mimetype === 'application/msword' || 
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed for resumes!'), false);
    }
};

// Create multer instances
export const uploadImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: imageFileFilter
});

export const uploadResume = multer({
    storage: resumeStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: resumeFileFilter
});

// Combined upload for both image and resume
export const uploadTeacherFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
                cb(null, './uploads/images');
            } else if (file.fieldname === 'resume') {
                cb(null, './uploads/resumes');
            }
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            if (file.fieldname === 'image') {
                cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
            } else if (file.fieldname === 'resume') {
                cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
            }
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            imageFileFilter(req, file, cb);
        } else if (file.fieldname === 'resume') {
            resumeFileFilter(req, file, cb);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Please upload a smaller file.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    } else if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
}; 