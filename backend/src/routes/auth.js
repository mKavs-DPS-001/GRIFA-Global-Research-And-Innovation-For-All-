import express from 'express';
import { verifyFirebaseToken, attachUserFromDB } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/auth/me
// Endpoint called after Firebase login to ensure user exists in MongoDB and get their role
router.post('/me', verifyFirebaseToken, attachUserFromDB, async (req, res) => {
  res.json({
    success: true,
    data: req.dbUser,
  });
});

export default router;
