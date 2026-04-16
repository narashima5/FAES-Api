import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
  try {
    const deps = await Department.find({});
    res.json(deps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    const dept = await Department.create({ name });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
