import express from 'express';
import {
  startSearching,
  checkMatchStatus,
  stopSearchingOrEndCall,
} from '../controllers/matchController.js';
import { protect } from '../middlwware/authMiddleware.js';

const router = express.Router();

// All match routes require authentication
router.post('/start', protect, startSearching);
router.get('/status', protect, checkMatchStatus);
router.post('/stop', protect, stopSearchingOrEndCall);

export default router;
