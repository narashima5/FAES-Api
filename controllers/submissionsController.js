import Submission from '../models/Submission.js';

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
      .populate({
         path: 'activity_id',
         populate: [
            { path: 'section_id', select: 'title' },
            { path: 'sub_section_id', select: 'title' }
         ]
      });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const { activity_id, description } = req.body;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const existing = await Submission.findOne({ 
       user_id: req.user._id, 
       activity_id,
       createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    if (existing) {
       return res.status(400).json({ message: 'You have already submitted proof for this activity this month. Navigate to "My Submissions" to edit it.' });
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
