const Student = require('../models/studentModel')
const mongoose = require('mongoose')

// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: 1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

// Get one student by _id
const getStudent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID format' });
    }

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}
// Get one student by id
const getStudentById = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const student = await Student.findOne({ studentId: studentId });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

const createStudent = async (req, res) => {
    let students = req.body;

    // ถ้า req.body ไม่ใช่อาร์เรย์ ให้แปลงเป็นอาร์เรย์ที่มีนักศึกษา 1 คน
    if (!Array.isArray(students)) {
        students = [students];
    }

    // ตรวจสอบอีกครั้งให้แน่ใจว่าเป็นอาร์เรย์
    if (!Array.isArray(students)) {
        return res.status(400).json({ error: "ข้อมูลที่ส่งมาต้องเป็นรายการนักศึกษา Array" });
    }

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    for (const s of students) {
        if (!s.studentId || !s.studentName || !s.department || !s.password) {
            return res.status(400).json({
                error: "กรุณากรอกข้อมูลให้ครบถ้วน",
                missing: s
            });
        }

        if (s.password.length > 6) {
            return res.status(400).json({
                error: "รหัสผ่านต้องไม่เกิน 6 ตัวอักษร",
                studentId: s.studentId
            });
        }
    }

    try {
        const formatted = students.map((s) => ({
            studentId: s.studentId,
            studentName: s.studentName,
            department: s.department,
            password: s.password,
            role: s.role || "user"
        }));

        const created = await Student.insertMany(formatted, { ordered: false });
        res.status(201).json({ message: `เพิ่มนักศึกษาสำเร็จจำนวน ${created.length} คน` });
    } catch (error) {
        // ตรวจสอบว่าเป็นการใส่รหัสนักศึกษาซ้ำหรือไม่
        if (error.code === 11000 || error.name === 'BulkWriteError') {
            return res.status(400).json({
                error: "มีรหัสนักศึกษาซ้ำในระบบ",
                details: error
            });
        }

        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message });
    }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
    const id = req.params.studentId;
/*     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID format' });
    } */
    try {
        const student = await Student.findOneAndDelete({ studentId: id });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully', student });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

// Update a student by ID
const updateStudent = async (req, res) => {
    const id = req.params.studentId;
    const { studentId, studentName, department, password } = req.body;

/*     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid student ID format' });
    } */

    if (studentId && !/^\d{9}$/.test(studentId)) {
        return res.status(400).json({ error: 'Student ID must be exactly 9 digits' });
    }

    if (studentName != null && studentName.trim() === '') {
        return res.status(400).json({ error: 'Student name cannot be empty' });
    }

    if (department != null && department.trim() === '') {
        return res.status(400).json({ error: 'Course cannot be empty' });
    }

    if (password && password.length > 6) {
        return res.status(400).json({ error: 'Password must not exceed 6 characters' });
    }

    try {
        const student = await Student.findOne({ studentId: id });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (studentId) student.studentId = studentId;
        if (studentName) student.studentName = studentName;
        if (department) student.department = department;
        if (password) student.password = password;

        await student.save();

        res.status(200).json(student);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate student ID' });
        }
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

module.exports = {
    getStudents,
    getStudent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}
