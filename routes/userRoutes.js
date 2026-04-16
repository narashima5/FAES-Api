import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getUsers, createUser, deleteUser } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getUsers);
router.post('/', protect, authorizeRoles('admin'), createUser);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;
