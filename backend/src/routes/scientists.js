import express from 'express';
import Scientist from '../models/Scientist.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/scientists (Public)
router.get('/', async (req, res, next) => {
  try {
    const scientists = await Scientist.find({ status: 'active' }).sort({ createdAt: -1 });
    // Transform to match old frontend ALL_SCIENTISTS array format for backward compatibility
    const formatted = scientists.map(s => ({
      id: s._id.toString(),
      name: s.name,
      institution: s.institution,
      expertise: s.specialization,
      tags: s.tags,
      photoUrl: s.image_url,
      disciplines: s.disciplines,
      status: s.status,
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/scientists/admin (Admin only - includes all statuses)
router.get('/admin', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const scientists = await Scientist.find().sort({ createdAt: -1 });
    const formatted = scientists.map(s => ({
      id: s._id.toString(),
      name: s.name,
      institution: s.institution,
      expertise: s.specialization,
      tags: s.tags,
      photoUrl: s.image_url,
      disciplines: s.disciplines,
      status: s.status,
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/scientists (Admin only)
router.post('/', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    // Map from frontend format if needed
    const payload = {
      name: req.body.name,
      institution: req.body.institution,
      specialization: req.body.expertise || req.body.specialization,
      tags: req.body.tags || [],
      image_url: req.body.photoUrl || req.body.image_url,
      disciplines: req.body.disciplines || [],
      status: req.body.status || 'active',
    };
    const scientist = await Scientist.create(payload);
    res.status(201).json({ success: true, data: {
      id: scientist._id.toString(),
      name: scientist.name,
      institution: scientist.institution,
      expertise: scientist.specialization,
      tags: scientist.tags,
      photoUrl: scientist.image_url,
      disciplines: scientist.disciplines,
      status: scientist.status,
    } });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/scientists/:id (Admin only)
router.patch('/:id', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const payload = {};
    if (req.body.name !== undefined) payload.name = req.body.name;
    if (req.body.institution !== undefined) payload.institution = req.body.institution;
    if (req.body.expertise !== undefined) payload.specialization = req.body.expertise;
    if (req.body.tags !== undefined) payload.tags = req.body.tags;
    if (req.body.photoUrl !== undefined) payload.image_url = req.body.photoUrl;
    if (req.body.disciplines !== undefined) payload.disciplines = req.body.disciplines;
    if (req.body.status !== undefined) payload.status = req.body.status;

    const scientist = await Scientist.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!scientist) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
    res.json({ success: true, data: {
      id: scientist._id.toString(),
      name: scientist.name,
      institution: scientist.institution,
      expertise: scientist.specialization,
      tags: scientist.tags,
      photoUrl: scientist.image_url,
      disciplines: scientist.disciplines,
      status: scientist.status,
    } });
  } catch (error) {
    next(error);
  }
});

export default router;
