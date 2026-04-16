import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getDepartmentReport, getGlobalReport, getSummary } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/department', protect, authorizeRoles('hod'), getDepartmentReport);
router.get('/global', protect, authorizeRoles('management', 'admin'), getGlobalReport);

export default router;
