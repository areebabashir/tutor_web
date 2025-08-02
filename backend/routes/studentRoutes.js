import express from 'express';
import {
  addStudent,
  getAllStudents,
  getStudentById,
  deleteStudent
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/get', addStudent);
router.get('/getAll', getAllStudents);
router.get('/get/:id', getStudentById);
router.delete('/delete/:id', deleteStudent);


export default router;
