import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getMySubmissions, getAllSubmissions, createSubmission, updateSubmission } from '../controllers/submissionsController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, getMySubmissions);
router.get('/all', protect, authorizeRoles('admin', 'management', 'iqac', 'hod'), getAllSubmissions);
router.post('/', protect, authorizeRoles('staff', 'hod'), upload.single('proof'), createSubmission);
router.put('/:id', protect, authorizeRoles('staff', 'hod'), upload.single('proof'), updateSubmission);

export default router;
