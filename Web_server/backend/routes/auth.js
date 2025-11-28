const express = require('express');
const router = express.Router();
const { loginStudent, getInfo } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { getExams, getExamById, getExamsByGroup, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { submitStudentAnswers, getStudentAnswers, getStudentAnswersById, updateStudentAnswer, updateStudentScores, deleteStudentAnswer } = require('../controllers/studentAnswerController');
const { createSetting, getSetting, updateSetting } = require('../controllers/settingController');
const { createGroup, getGroups, getGroupById, updateGroup, deleteGroup} = require('../controllers/groupController');

// POST /api/auth/login
router.post('/login', loginStudent);

// GET /api/auth/getInfo
router.get('/getInfo', requireAuth, getInfo);

//// Exam
// GET /api/auth/exams 
router.get('/exams', requireAuth, getExams);

// GET /api/auth/exams/:examId
router.get('/exams/:examId', requireAuth, getExamById);

// GET /api/auth/exams/group/:groupId
router.get('/exams/group/:groupId', requireAuth, getExamsByGroup);

// POST /api/auth/exams
router.post('/exams', requireAuth, createExam);

// PUT /api/auth/exams/:examId
router.put('/exams/:examId', requireAuth, updateExam);

// DEL /api/auth/exams/:examId
router.delete('/exams/:examId', requireAuth, deleteExam);

//// StudentAnswers
// GET /api/auth/answers/getInfo
router.get('/answers', requireAuth, getStudentAnswers);

// GET /api/auth/answers/getInfo/:studentId
router.get('/answers/:studentId', requireAuth, getStudentAnswersById);

// POST /api/auth/answers
router.post('/answers', requireAuth, submitStudentAnswers);

// PUT /api/auth/answers/:studentId
router.put('/answers/:studentId', requireAuth, updateStudentAnswer);

// PUT /api/auth/scores/:studentId
router.put('/answers/scores/:studentId', requireAuth, updateStudentScores);

// DEL /api/auth/answers/:studentId
router.delete('/answers/:studentId', requireAuth, deleteStudentAnswer);

//// CreateSettings
// GET /api/auth/settings
router.get('/settings', requireAuth, getSetting);

// POST /api/auth/settings
router.post('/settings', requireAuth, createSetting);

// PUT /api/auth/settings
router.put('/settings', requireAuth, updateSetting);

//// Group 
// GET /api/auth/group
router.get('/group', requireAuth, getGroups);

// GET /api/auth/group:groupId
router.get('/group/:groupId', requireAuth, getGroupById);

// POST /api/auth/group
router.post('/group', requireAuth, createGroup);

// PUT /api/auth/group/:groupId
router.put('/group/:groupId', requireAuth, updateGroup);

// DEL /api/auth/group/:groupId
router.delete('/group/:groupId', requireAuth, deleteGroup);

module.exports = router;
