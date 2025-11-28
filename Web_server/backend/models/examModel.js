const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionId: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    modelAnswers: {
        type: [String],
        required: true
    },
    answersScore: {
        type: Number,
        default: null
    }
});

const examSchema = new Schema({
    examId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    totalAnswersScore: {
        type: Number,
        default: null
    },
    allowedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
