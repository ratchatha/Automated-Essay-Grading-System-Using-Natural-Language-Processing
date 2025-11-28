const express = require('express');
const {
    getStudents,
    getStudent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} = require('../controllers/studentControler');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth); // Protect all student routes
router.get('/', getStudents);
router.get('/:id', getStudent);
router.get('/StudentId/:studentId', getStudentById);
router.post('/create', createStudent);
router.delete('/:studentId', deleteStudent);
router.put('/:studentId', updateStudent);

module.exports = router;
