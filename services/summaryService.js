import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Activity from '../models/Activity.js';
import Evaluation from '../models/Evaluation.js';
import Section from '../models/Section.js';
import Department from '../models/Department.js';

export const getStaffSummary = async (user) => {
   const query = { user_id: user._id };
   const submissions = await Submission.find(query);
   const evalQuery = submissions.map(s => s._id);
   const evaluations = await Evaluation.find({ submission_id: { $in: evalQuery } });
   
   return {
     totalActivities: await Activity.countDocuments(),
     completed: submissions.filter(s => s.status === 'approved').length,
     pending: submissions.filter(s => s.status === 'pending').length,
     totalScore: evaluations.reduce((sum, ev) => sum + ev.marks, 0),
     recent: await Submission.find(query).sort({ createdAt: -1 }).limit(5).populate('activity_id', 'title').populate('user_id', 'name')
   };
};

export const getHodSummary = async (user) => {
   const users = await User.find({ department_id: user.department_id }).select('_id');
   const query = { user_id: { $in: users.map(u => u._id) } };
   const submissions = await Submission.find(query);
   
   const evalQuery = submissions.map(s => s._id);
   const evaluations = await Evaluation.find({ submission_id: { $in: evalQuery } });
   
   return {
     totalActivities: await Activity.countDocuments(),
     completed: submissions.filter(s => s.status === 'approved').length,
     pending: submissions.filter(s => s.status === 'pending').length,
     totalScore: evaluations.reduce((sum, ev) => sum + ev.marks, 0),
     recent: await Submission.find(query).sort({ createdAt: -1 }).limit(5).populate('activity_id', 'title').populate('user_id', 'name')
   };
};

export const getAdminSummary = async () => {
   return {
     totalUsers: await User.countDocuments({ role: { $ne: 'admin' } }),
     totalDepartments: await Department.countDocuments(),
     totalSections: await Section.countDocuments(),
     totalActivities: await Activity.countDocuments()
   };
};

export const getIqacSummary = async () => {
   const subs = await Submission.find();
   return {
     pendingReviews: subs.filter(s => s.status === 'pending').length,
     completedReviews: subs.filter(s => s.status !== 'pending').length,
     totalSubmissions: subs.length,
     totalActivities: await Activity.countDocuments()
   };
};

export const getManagementSummary = async () => {
   return {
     totalFaculty: await User.countDocuments({ role: { $in: ['staff', 'hod'] } }),
     totalSubmissions: await Submission.countDocuments(),
     approvedPerformances: await Submission.countDocuments({ status: 'approved' }),
     platformActivities: await Activity.countDocuments()
   }
};

export const generateSummaryByRole = async (user) => {
    switch(user.role) {
        case 'staff': return await getStaffSummary(user);
        case 'hod': return await getHodSummary(user);
        case 'admin': return await getAdminSummary();
        case 'iqac': return await getIqacSummary();
        case 'management': return await getManagementSummary();
        default: return {};
    }
};
