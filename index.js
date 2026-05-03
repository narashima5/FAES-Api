import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
