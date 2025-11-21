const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    examInfo: {
        examType: {
            type: String, required: true

        },
        semester: {
            type: String, required: true

        },
        academicYear: {
            type: String, required: true

        }
    },
    examSchedule: {
        subjectCategory: {
            type: String, required: true

        },
        examDate: {
            type: Date, required: true

        },
        startTime: {
            type: String, required: true

        },
        endTime: {
            type: String, required: true

        },
        room: {
            type: String, required: true

        }
    },
    instructions: [
        { type: String }
    ],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingSchema);
