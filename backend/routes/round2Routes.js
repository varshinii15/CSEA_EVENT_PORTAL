import express from 'express';
import {
  createQuestion,
  getQuestionsByYear,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from '../controllers/round2Controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/round2/questions/:lang
router.post('/questions/:lang', verifyToken, createQuestion);

// GET /api/v1/round2/questions?yr=1 (or /api/v1/round2/questions/yr as query param)
router.get('/questions', verifyToken, getQuestionsByYear);

// GET /api/v1/round2/questions/:id (optional - for getting a single question by ID)
router.get('/questions/:id', verifyToken, getQuestionById);

// PUT /api/v1/round2/questions/:id
router.put('/questions/:id', verifyToken, updateQuestion);

// DELETE /api/v1/round2/questions/:id
router.delete('/questions/:id', verifyToken, deleteQuestion);

export default router;

