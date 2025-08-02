import express from 'express';
import {
  addContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact
router.post('/contact/add', addContact);

// GET /api/contacts
router.get('/contact/get', getAllContacts);

// GET /api/contact/:id
router.get('/contact/get/:id', getContactById);

// DELETE /api/contact/:id
router.delete('/contact/delete/:id', deleteContact);

export default router;
