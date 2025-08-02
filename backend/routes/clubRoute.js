import express from 'express';
import {
  createClub,
  updateClub,
  getAllClubs,
  getClubById,
  deleteClub
} from '../controllers/clubController.js';
import { validateClub } from '../Middlewares/validateClub.js';

const router = express.Router();

// Create a new club
router.post('/create', validateClub, createClub);

// Update a club
router.put('/update/:id', validateClub, updateClub);

// Get all clubs with optional filtering
router.get('/all', getAllClubs);

// Get a single club by ID
router.get('/get/:id', getClubById);


// Delete a club
router.delete('/:id', deleteClub);

export default router;