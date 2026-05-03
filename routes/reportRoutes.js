import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getDepartmentReport, getGlobalReport, getSummary, getMonthlyFacultyReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/monthly', protect, getMonthlyFacultyReport);
router.get('/summary', protect, getSummary);
router.get('/department', protect, authorizeRoles('hod'), getDepartmentReport);
router.get('/global', protect, authorizeRoles('management', 'admin'), getGlobalReport);

export default router;
