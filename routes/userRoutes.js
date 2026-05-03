import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getUsers, createUser, deleteUser, getDepartmentStaff, updateMonthlyTarget } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/department-staff', protect, authorizeRoles('hod'), getDepartmentStaff);
router.post('/', protect, authorizeRoles('admin'), createUser);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);
router.put('/target', protect, authorizeRoles('staff', 'hod'), updateMonthlyTarget);

export default router;
