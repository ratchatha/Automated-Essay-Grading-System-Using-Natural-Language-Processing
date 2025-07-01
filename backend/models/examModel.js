const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
    }
});

const chapterSchema = new mongoose.Schema({
    chapterTitle: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true
    }
});

const examSchema = new mongoose.Schema(
    {
        examId: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        chapters: {
            type: [chapterSchema],
            required: true
        }
    },
    { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
