import Section from '../models/Section.js';
import Activity from '../models/Activity.js';

export const getSections = async (req, res) => {
  try {
    const sections = await Section.find({});
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSection = async (req, res) => {
  try {
    const { title } = req.body;
    const section = await Section.create({ title });
    res.status(201).json(section);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A section with this title already exists' });
    }
    console.error('Error creating section:', error);
    res.status(500).json({ message: error.message });
  }
};

import SubSection from '../models/SubSection.js';

export const getSubSections = async (req, res) => {
  try {
    const subSections = await SubSection.find({}).populate('section_id', 'title');
    res.json(subSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubSection = async (req, res) => {
  try {
    const { section_id, title } = req.body;
    const subSection = await SubSection.create({ section_id, title });
    res.status(201).json(subSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
       .populate('section_id', 'title')
       .populate('sub_section_id', 'title');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { section_id, sub_section_id, title, max_marks, criteria, proof_type } = req.body;
    const activity = await Activity.create({
      section_id, sub_section_id, title, max_marks, criteria, proof_type
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
