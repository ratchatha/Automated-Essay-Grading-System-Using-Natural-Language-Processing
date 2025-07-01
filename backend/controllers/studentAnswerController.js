const StudentAnswer = require('../models/studentAnswerModel');

const submitStudentAnswers = async (req, res) => {
    try {
        const { student, studentId, studentName, examId, answers } = req.body;
        console.log("Request body received:", req.body);
        if (!student || !studentId || !studentName || !examId || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Missing required fields or answers format invalid.' });
        }
        
        const newAnswer = new StudentAnswer({
            student,
            studentId,
            studentName,
            examId,
            answers,
        });

        const savedAnswer = await newAnswer.save();

        res.status(201).json({ message: 'Answers submitted successfully', data: savedAnswer });
    } catch (error) {
        console.error('Error submitting student answers:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

const getStudentAnswers = async (req, res) => {
    try {
        const answers = await StudentAnswer.find().sort({ createdAt: 1 });
        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching student answers:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

module.exports = {
    submitStudentAnswers,
    getStudentAnswers,
};
