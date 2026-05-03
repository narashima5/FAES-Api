import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getDepartments, createDepartment, updateNoticeboard } from '../controllers/departmentsController.js';

const router = express.Router();

router.get('/', protect, getDepartments);
router.post('/', protect, authorizeRoles('admin'), createDepartment);
router.put('/noticeboard', protect, authorizeRoles('hod'), updateNoticeboard);

export default router;
