import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Evaluation from '../models/Evaluation.js';

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

import Section from '../models/Section.js';
import Department from '../models/Department.js';

export const getSummary = async (req, res) => {
  try {
    const role = req.user.role;
    let payload = {};

    if (role === 'staff' || role === 'hod') {
       let query = {};
       if (role === 'staff') query = { user_id: req.user._id };
       else {
          const users = await User.find({ department_id: req.user.department_id }).select('_id');
          query = { user_id: { $in: users.map(u => u._id) } };
       }
       const submissions = await Submission.find(query);
       
       const evalQuery = submissions.map(s => s._id);
       const evaluations = await Evaluation.find({ submission_id: { $in: evalQuery } });
       
       payload = {
         totalActivities: await Activity.countDocuments(),
         completed: submissions.filter(s => s.status === 'approved').length,
         pending: submissions.filter(s => s.status === 'pending').length,
         totalScore: evaluations.reduce((sum, ev) => sum + ev.marks, 0),
         recent: await Submission.find(query).sort({ createdAt: -1 }).limit(5).populate('activity_id', 'title').populate('user_id', 'name')
       };
    } 
    else if (role === 'admin') {
       payload = {
         totalUsers: await User.countDocuments({ role: { $ne: 'admin' } }),
         totalDepartments: await Department.countDocuments(),
         totalSections: await Section.countDocuments(),
         totalActivities: await Activity.countDocuments()
       };
    }
    else if (role === 'iqac') {
       const subs = await Submission.find();
       payload = {
         pendingReviews: subs.filter(s => s.status === 'pending').length,
         completedReviews: subs.filter(s => s.status !== 'pending').length,
         totalSubmissions: subs.length,
         totalActivities: await Activity.countDocuments()
       };
    }
    else if (role === 'management') {
       payload = {
         totalFaculty: await User.countDocuments({ role: { $in: ['staff', 'hod'] } }),
         totalSubmissions: await Submission.countDocuments(),
         approvedPerformances: await Submission.countDocuments({ status: 'approved' }),
         platformActivities: await Activity.countDocuments()
       }
    }

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
