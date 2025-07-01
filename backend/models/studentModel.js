const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)