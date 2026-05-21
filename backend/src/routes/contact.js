import express from 'express';
import rateLimit from 'express-rate-limit';
import ContactMessage from '../models/ContactMessage.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Basic rate limiting for contact form: 5 requests per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

// POST /api/v1/contact
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const newMsg = await ContactMessage.create({
      name,
      email,
      subject: subject || 'No Subject',
      message
    });

    res.status(201).json({ success: true, data: { id: newMsg._id } });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/contact/admin/all (Admin only)
router.get('/admin/all', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    const formatted = messages.map(m => ({
      id: m._id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      createdAt: m.createdAt,
      read: m.read || false
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

export default router;
