import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { getSections, createSection, getSubSections, createSubSection, getActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activitiesController.js';

const router = express.Router();

router.get('/sections', protect, getSections);
router.post('/sections', protect, authorizeRoles('admin'), createSection);

router.get('/subsections', protect, getSubSections);
router.post('/subsections', protect, authorizeRoles('admin'), createSubSection);

router.get('/', protect, getActivities);
router.post('/', protect, authorizeRoles('admin'), createActivity);
router.put('/:id', protect, authorizeRoles('admin'), updateActivity);
router.delete('/:id', protect, authorizeRoles('admin'), deleteActivity);

export default router;
