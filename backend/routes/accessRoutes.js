// routes/portalRoutes.js
import express from 'express';
import {authorizeYear } from '../middleware/portalMiddleware.js';
import { authenticateToken } from '../middleware/verifyToken.js';
import { getYear1Portal, getYear2Portal } from '../controllers/portalController.js';

const router = express.Router();

router.get('/year1', authenticateToken, authorizeYear(1), getYear1Portal);
router.get('/year2', authenticateToken, authorizeYear(2), getYear2Portal);

export default router;
