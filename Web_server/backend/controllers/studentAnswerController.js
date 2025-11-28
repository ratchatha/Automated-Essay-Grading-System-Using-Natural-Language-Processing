const StudentAnswer = require('../models/studentAnswerModel');
const Exam = require('../models/examModel');
const Student = require('../models/studentModel');
const Group = require('../models/groupModel');

const axios = require('axios');
const submitStudentAnswers = async (req, res) => {
    try {
        const { student, studentId, studentName, department, examId, title, answers } = req.body;

        if (!student || !studentId || !studentName || !department || !examId || !title || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Missing required fields or answers format invalid.' });
        }
        const foundStudent = await Student.findById(student).populate('group');
        const foundExam = await Exam.findOne({ examId }).populate('allowedGroups');

        if (!foundStudent || !foundExam) {
            return res.status(404).json({ error: 'ไม่พบนักศึกษาหรือข้อสอบ' });
        }

/*         const studentGroupId = foundStudent.group?._id?.toString();
        const allowedGroupIds = foundExam.allowedGroups.map(g => g._id.toString());

        if (!allowedGroupIds.includes(studentGroupId)) {
            return res.status(403).json({
                error: 'กลุ่มของคุณไม่ได้รับอนุญาตให้ทำข้อสอบนี้'
            });
        } */

        const newAnswer = new StudentAnswer({
            student,
            studentId,
            studentName,
            department,
            group: foundStudent.group,
            exam: foundExam._id,
            examId,
            title,
            answers
        });


        const savedAnswer = await newAnswer.save();

        // เรียก FastAPI เพื่อให้ประเมินคะแนน
        try {
            axios.post('http://localhost:5000/evaluate', {
                studentId,
                studentName,
                examId,
                answers,
            });
            console.log("เรียก FastAPI ประเมินคะแนนแล้ว");
        } catch (evaluationError) {
            console.error("เกิดข้อผิดพลาดในการเรียก FastAPI:", evaluationError.message);
        }

        res.status(201).json({ message: 'Answers submitted successfully', data: savedAnswer });
    } catch (error) {
        console.error('Error submitting student answers:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

//get all 
const getStudentAnswers = async (req, res) => {
    try {
        const answers = await StudentAnswer.find().sort({ createdAt: 1 });
        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching student answers:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

//get student by id
const getStudentAnswersById = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await StudentAnswer.findOne({ studentId: studentId }).sort({ createdAt: -1 });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

// Put
const updateStudentAnswer = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { studentName, department } = req.body;
        const updateData = {};
        if (studentName) updateData.studentName = studentName;
        if (department) updateData.department = department;

        const updatedAnswer = await StudentAnswer.findOneAndUpdate(
            { studentId: studentId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAnswer) {
            return res.status(404).json({ error: 'ไม่พบคำตอบนักศึกษาในระบบ' });
        }

        res.status(200).json({ message: 'อัปเดตคำตอบเรียบร้อย', updatedAnswer });
    } catch (error) {
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์: ' + error.message });
    }
};

// update score
const updateStudentScores = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "รูปแบบข้อมูล answers ไม่ถูกต้อง",
            });
        }

        const totalScore = answers.reduce((sum, ans) => {
            return sum + (ans.score || 0);
        }, 0);

        const updatedStudent = await StudentAnswer.findOneAndUpdate(
            { studentId: studentId },
            {
                answers: answers,
                totalScore: totalScore
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบนักศึกษาหรือคำตอบในระบบ",
            });
        }

        res.status(200).json({
            success: true,
            message: "อัปเดตคะแนนสำเร็จแล้ว",
            data: updatedStudent,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์: " + error.message,
        });
    }
};

//del
const deleteStudentAnswer = async (req, res) => {
    const { studentId } = req.params;
    try {
        const deletedAnswer = await StudentAnswer.findOneAndDelete({ studentId: studentId });
        if (!deletedAnswer) {
            return res.status(404).json({ error: 'ไม่พบคำตอบของนักศึกษาในระบบ' });
        }

        res.status(200).json({ message: 'ลบคำตอบนักศึกษาสำเร็จ', deletedAnswer });
    } catch (error) {
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์: ' + error.message });
    }
};

module.exports = {
    submitStudentAnswers,
    getStudentAnswers,
    getStudentAnswersById,
    updateStudentAnswer,
    updateStudentScores,
    deleteStudentAnswer,
};
