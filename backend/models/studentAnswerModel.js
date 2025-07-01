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
    examId: {
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
                required: true
            },
            score: {
                type: Number,
                default: null
            }
        }
    ]
}, 
{
    timestamps: true,
    collection: 'studentAnswers'
});

module.exports = mongoose.model('StudentAnswer', studentAnswerSchema);
