import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { evaluateSubmission } from '../controllers/evaluationsController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('iqac'), evaluateSubmission);

export default router;
