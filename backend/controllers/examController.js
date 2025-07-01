const Exam = require('../models/examModel');

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({ examId: req.params.examId });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { 
  getExams,
  getExamById
};
