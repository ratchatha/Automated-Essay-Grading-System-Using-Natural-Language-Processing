const express = require('express');
const router = express.Router();
const { loginStudent, getInfo } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { getExams, getExamById } = require('../controllers/examController');
const { submitStudentAnswers, getStudentAnswers } = require('../controllers/studentAnswerController')

// POST /api/auth/login
router.post('/login', loginStudent);

// GET /api/auth/getInfo
router.get('/getInfo', requireAuth, getInfo);

// GET /api/auth/exams 
router.get('/exams', requireAuth, getExams);

// GET /api/auth/exams/:examId
router.get('/exams/:examId',requireAuth ,getExamById);

// POST /api/auth/answers
router.post('/answers', requireAuth, submitStudentAnswers);

// GET /api/auth/answers/getInfo
router.get('/answers', requireAuth, getStudentAnswers);

module.exports = router;
