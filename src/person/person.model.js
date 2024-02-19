import mongoose, { Schema, model } from "mongoose"

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },

    course:{
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['STUDENT', 'TEACHER'],
        required: true
    }
},{
    versionKey: false
})

export default mongoose.model('person', personSchema)