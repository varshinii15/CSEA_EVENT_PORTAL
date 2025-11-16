import express from 'express';
import {
  createAnswer,
  getAllAnswers,
  getAnswer,
  updateAnswer,
  deleteAnswer,
  submitPlayerAnswer
} from '../controllers/round3Controller.js';

const router = express.Router();

// POST /api/v1/round3/answers
router.post('/answers', createAnswer);

// GET /api/v1/round3/answers/:year
router.get('/answers', getAllAnswers); 
router.get('/answers/:year', getAnswer);

// PUT /api/v1/round3/answers/:id
router.put('/answers/:id', updateAnswer);

// DELETE /api/v1/round3/answers/:id
router.delete('/answers/:id', deleteAnswer);

// PLAYER submits answer (must use verifyToken in main server)
router.post('/submit', submitPlayerAnswer);


export default router;
