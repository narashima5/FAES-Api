import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, authorizeRoles('admin'), updateSettings);

export default router;
