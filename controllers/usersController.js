import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('department_id', 'name').select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentStaff = async (req, res) => {
  try {
    const staff = await User.find({ department_id: req.user.department_id, role: 'staff' }).select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };
    if (department_id) userData.department_id = department_id;

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department_id: user.department_id,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMonthlyTarget = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.monthly_target) return res.status(400).json({ message: 'Target already locked.' });
    
    user.monthly_target = req.body.target;
    await user.save();
    
    res.json({ message: 'Target locked', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
