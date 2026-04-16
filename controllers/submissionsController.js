import Submission from '../models/Submission.js';
import Setting from '../models/Setting.js';

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user_id: req.user._id }).populate('activity_id');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate({
         path: 'user_id',
         select: 'name role department_id',
         populate: { path: 'department_id', select: 'name' }
      })
      .populate('activity_id');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    if (setting && setting.submission_deadline < new Date()) {
      return res.status(403).json({ message: 'Submission deadline has passed' });
    }

    const { activity_id, description } = req.body;

    const existing = await Submission.findOne({ user_id: req.user._id, activity_id });
    if (existing) {
       return res.status(400).json({ message: 'You have already submitted proof for this activity. Navigate to "My Submissions" to edit it.' });
    }

    let proof_url = req.body.proof_url || '';

    if (req.file) {
      proof_url = req.file.path.replace(/\\/g, '/'); // normalize path
    }

    const submission = await Submission.create({
      user_id: req.user._id,
      activity_id,
      proof_url,
      description
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    if (setting && setting.submission_deadline < new Date()) {
      return res.status(403).json({ message: 'Submission deadline has passed. Cannot edit.' });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this submission' });
    }

    submission.description = req.body.description || submission.description;
    
    if (req.file) {
      submission.proof_url = req.file.path.replace(/\\/g, '/');
    } else if (req.body.proof_url) {
      submission.proof_url = req.body.proof_url;
    }

    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
