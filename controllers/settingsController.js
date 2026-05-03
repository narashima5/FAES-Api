import Setting from '../models/Setting.js';

export const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }
    
    setting.maintenance_mode = req.body.maintenance_mode !== undefined ? req.body.maintenance_mode : setting.maintenance_mode;
    setting.emergency_override = req.body.emergency_override !== undefined ? req.body.emergency_override : setting.emergency_override;
    setting.platform_title = req.body.platform_title || setting.platform_title;
    setting.primary_color = req.body.primary_color || setting.primary_color;

    await setting.save();
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
