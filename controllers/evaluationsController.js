import Evaluation from '../models/Evaluation.js';
import Submission from '../models/Submission.js';
import Activity from '../models/Activity.js';

export const evaluateSubmission = async (req, res) => {
  try {
    const { submission_id, marks, comments, status } = req.body;

    const submission = await Submission.findById(submission_id).populate('activity_id');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (!submission.activity_id) {
      return res.status(400).json({ message: 'The mapped activity was removed. Evaluation blocked.'});
    }

    if (marks > submission.activity_id.max_marks) {
      return res.status(400).json({ 
        message: `Marks cannot exceed maximum marks (${submission.activity_id.max_marks})` 
      });
    }

    // Update submission status
    submission.status = status;
    submission.marks = marks;
    submission.comments = comments;
    await submission.save();

    // Check if evaluation exists
    let evaluation = await Evaluation.findOne({ submission_id });
    if (evaluation) {
      evaluation.marks = marks;
      evaluation.comments = comments;
      evaluation.evaluator_id = req.user._id;
      await evaluation.save();
    } else {
      evaluation = await Evaluation.create({
        submission_id,
        evaluator_id: req.user._id,
        marks,
        comments
      });
    }

    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
