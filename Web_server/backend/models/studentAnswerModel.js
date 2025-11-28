const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentAnswerSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    examId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    answers: [
        {
            questionId: {
                type: String,
                required: true
            },
            studentAnswer: {
                type: String,
                required: false,
                default: ""
            },
            score: {
                type: Number,
                default: null
            }
        }
    ],
    totalScore: {
        type: Number,
        default: null
    }
}, {
    timestamps: true,
    collection: 'studentAnswers'
});

module.exports = mongoose.model('StudentAnswer', studentAnswerSchema);
