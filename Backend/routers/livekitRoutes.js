import express from 'express';
import { getToken } from '../controllers/livekitController.js';
import { protect } from '../middlwware/authMiddleware.js';

const router = express.Router();

router.post('/token', protect, getToken);

export default router;
