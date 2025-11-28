const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken');

const loginStudent = async (req, res) => {
    const { studentId, password } = req.body;

    if (!studentId || !password)
        return res.status(400).json({ error: 'Student ID and password required' });

    try {
        const student = await Student.findOne({ studentId });

        if (!student)
            return res.status(400).json({ error: 'รหัสนักศึกษาไม่ถูกต้อง' });

        if (student.password !== password)
            return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });

        const token = jwt.sign({
            id: student._id,
            studentId: student.studentId,
            role: student.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getInfo = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.user.studentId });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    loginStudent,
    getInfo,
};
