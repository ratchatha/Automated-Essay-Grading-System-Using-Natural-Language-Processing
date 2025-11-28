const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  groupName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
