import express from 'express';
import Problem from '../models/Problem.js';
import { redis } from '../services/redis.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/problems (Public)
router.get('/', async (req, res, next) => {
  try {
    const problems = await Problem.find({ status: 'active' }).sort({ createdAt: -1 });
    
    const formatted = problems.map(p => ({
      id: p.slug,
      title: p.title,
      description: p.description,
      disciplines: p.disciplines,
      category: p.disciplines && p.disciplines.length > 0 ? p.disciplines[0] : 'General',
      views: p.views,
      status: p.status,
      featured: p.is_featured
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/problems/admin/all (Admin only)
router.get('/admin/all', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    const formatted = problems.map(p => ({
      id: p.slug,
      title: p.title,
      description: p.description,
      disciplines: p.disciplines,
      category: p.disciplines && p.disciplines.length > 0 ? p.disciplines[0] : 'General',
      views: p.views,
      status: p.status,
      featured: p.is_featured
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/problems/:slug (Public - increments view count)
router.get('/:slug', async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });

    await redis.incr(`views:problem:${problem.slug}`);
    problem.views += 1;
    await problem.save();

    res.json({ success: true, data: {
      id: problem.slug,
      title: problem.title,
      description: problem.description,
      details: problem.details,
      disciplines: problem.disciplines,
      category: problem.disciplines && problem.disciplines.length > 0 ? problem.disciplines[0] : 'General',
      views: problem.views,
      status: problem.status,
      featured: problem.is_featured
    } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/problems (Admin only)
router.post('/', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const payload = {
      slug: req.body.id || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      details: req.body.details,
      disciplines: req.body.disciplines || (req.body.category ? [req.body.category] : []),
      status: req.body.status || 'active',
      is_featured: req.body.featured || false,
      views: req.body.views || 0,
    };
    const problem = await Problem.create(payload);
    res.status(201).json({ success: true, data: {
      id: problem.slug,
      title: problem.title,
      description: problem.description,
      disciplines: problem.disciplines,
      category: problem.disciplines && problem.disciplines.length > 0 ? problem.disciplines[0] : 'General',
      views: problem.views,
      status: problem.status,
      featured: problem.is_featured
    } });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/problems/:slug (Admin only)
router.patch('/:slug', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const payload = {};
    if (req.body.title !== undefined) payload.title = req.body.title;
    if (req.body.description !== undefined) payload.description = req.body.description;
    if (req.body.details !== undefined) payload.details = req.body.details;
    if (req.body.disciplines !== undefined) payload.disciplines = req.body.disciplines;
    if (req.body.category !== undefined) payload.disciplines = [req.body.category];
    if (req.body.status !== undefined) payload.status = req.body.status;
    if (req.body.featured !== undefined) payload.is_featured = req.body.featured;

    const problem = await Problem.findOneAndUpdate({ slug: req.params.slug }, payload, { new: true });
    if (!problem) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
    
    res.json({ success: true, data: {
      id: problem.slug,
      title: problem.title,
      description: problem.description,
      disciplines: problem.disciplines,
      category: problem.disciplines && problem.disciplines.length > 0 ? problem.disciplines[0] : 'General',
      views: problem.views,
      status: problem.status,
      featured: problem.is_featured
    } });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/problems/:slug (Admin only)
router.delete('/:slug', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndDelete({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
