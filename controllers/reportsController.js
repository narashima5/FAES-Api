import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Section from '../models/Section.js';
import { generateSummaryByRole } from '../services/summaryService.js';
import { generateMonthlyFacultyReport } from '../services/reportService.js';

export const getDepartmentReport = async (req, res) => {
  try {
    const users = await User.find({ department_id: req.user.department_id }).select('_id');
    const userIds = users.map(u => u._id);

    const submissions = await Submission.find({ user_id: { $in: userIds } })
      .populate('user_id', 'name')
      .populate('activity_id');
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGlobalReport = async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate({
        path: 'user_id',
        populate: { path: 'department_id', select: 'name' }
      })
      .populate('activity_id');
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const payload = await generateSummaryByRole(req.user);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlyFacultyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const role = req.user.role;
    let userQuery = { role: { $in: ['staff', 'hod'] } };

    if (role === 'staff') {
      userQuery._id = req.user._id;
    } else if (role === 'hod') {
      userQuery.department_id = req.user.department_id;
    }

    const users = await User.find(userQuery).select('-password').populate('department_id', 'name');
    const userIds = users.map(u => u._id);

    const sections = await Section.find();
    
    const report = generateMonthlyFacultyReport(users, submissions, sections, currentMonth, currentYear);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
