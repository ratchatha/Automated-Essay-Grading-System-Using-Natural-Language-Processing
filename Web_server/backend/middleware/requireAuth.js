const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing or invalid token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student)
      return res.status(401).json({ message: 'Invalid token: user not found' });

    req.user = {
      id: student._id,
      studentId: student.studentId,
      role: student.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

module.exports = requireAuth;
