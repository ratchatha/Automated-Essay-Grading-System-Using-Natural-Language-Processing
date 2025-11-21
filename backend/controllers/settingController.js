const Setting = require('../models/settingModel');

const createSetting = async (req, res) => {
    try {
        const setting = new Setting(req.body);
        await setting.save();
        res.status(201).json({ success: true, data: setting });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne().sort({ createdAt: -1 }); // ล่าสุด

        if (!setting) {
            return res.status(404).json({ success: false, message: "ยังไม่มีข้อมูลการตั้งค่า" });
        }

        res.status(200).json({ success: true, data: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSetting = async (req, res) => {
    try {
        let setting = await Setting.findOne().sort({ createdAt: -1 });

        if (!setting) {
            // ถ้ายังไม่มี ให้สร้างใหม่แทน
            setting = await Setting.create(req.body);
            return res.status(201).json({ success: true, data: setting });
        }

        Object.assign(setting, req.body);
        await setting.save();

        res.status(200).json({ success: true, data: setting });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
module.exports = {
    createSetting,
    getSetting,
    updateSetting,
};