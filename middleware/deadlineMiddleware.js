import Setting from '../models/Setting.js';

export const checkSubmissionDeadline = async (req, res, next) => {
  try {
    const setting = await Setting.findOne();
    const today = new Date().getDate();
    if (today > 28 && (!setting || !setting.emergency_override)) {
      return res.status(403).json({ message: 'Submissions are only allowed between the 1st and 28th of the month. Emergency override is disabled.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking deadline configuration' });
  }
};
