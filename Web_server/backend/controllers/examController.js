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
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
// GET /api/exams/group/:groupId
const getExamsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const exams = await Exam.find({ allowedGroups: groupId });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// สร้างข้อสอบ
const createExam = async (req, res) => {
  try {
    const { examId, title, questions = [] } = req.body;
    if (!examId || !title) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }
    const trimmedExamId = examId.trim();

    if (trimmedExamId.length === 0) {
      return res.status(400).json({
        success: false,
        message: "รหัสข้อสอบต้องไม่เป็นค่าว่าง",
      });
    }

    const existingExam = await Exam.findOne({ examId: trimmedExamId });
    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "มีรหัสข้อสอบนี้ซ้ำอยู่ในระบบกรุณาลองใหม่",
      });
    }
    const updatedQuestions = questions.map((q) => ({
      ...q,
      answersScore: q.answersScore ?? 0,
    }));

    const totalAnswersScore = updatedQuestions.reduce(
      (sum, q) => sum + (q.answersScore || 0),
      0
    );

    const newExam = new Exam({
      examId,
      title,
      questions: updatedQuestions,
      totalAnswersScore,
    });
    await newExam.save();

    res.status(201).json({
      success: true,
      message: "สร้างข้อสอบสำเร็จ",
      exam: newExam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง",
      error: error.message,
    });
  }
};

// อัปเดตข้อสอบตาม examId
const updateExam = async (req, res) => {
  try {
    const { questions = [] } = req.body;

    const totalAnswersScore = questions.reduce(
      (sum, q) => sum + (Number(q.answersScore) || 0),
      0
    );

    const updateData = {
      ...req.body,
      totalAnswersScore,
    };

    const updated = await Exam.findOneAndUpdate(
      { examId: req.params.examId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json({
      message: "อัปเดตข้อสอบสำเร็จ",
      totalAnswersScore,
      exam: updated,
    });
  } catch (err) {
    console.error("Update exam error:", err);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง",
      error: err.message,
    });
  }
};


// ลบข้อสอบตาม examId
const deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findOneAndDelete({ examId: req.params.examId });
    if (!deleted) return res.status(404).json({ error: 'Exam not found' });
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getExams,
  getExamById,
  getExamsByGroup,
  createExam,
  updateExam,
  deleteExam
};
