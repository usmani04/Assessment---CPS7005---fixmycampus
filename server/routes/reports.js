import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  getMyReports,
  deleteReport,
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createReport);
router.get('/', authenticateToken, getReports);
router.get('/my-reports', authenticateToken, getMyReports);
router.get('/:id', authenticateToken, getReportById);
router.put('/:id', authenticateToken, updateReport);
router.delete('/:id', authenticateToken, deleteReport);

export default router;
