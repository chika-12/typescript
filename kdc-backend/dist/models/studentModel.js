//@ts-nocheck
import mongoose from 'mongoose';
//import { parseDMYDate } from '../utils/dateParser.ts';
import bcrypt from 'bcryptjs';
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    class: {
        type: String,
        required: true,
        enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
    },
    role: {
        type: String,
        default: 'student',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
    },
    mustChangePassword: {
        type: Boolean,
        default: false,
    },
    parentsContact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        relationship: {
            type: String,
            enum: ['father', 'mother', 'guardian'],
            required: true,
        },
    },
    studentFile: {
        type: String, // Cloudinary URL
    },
}, { timestamps: true });
studentSchema.index({ name: 1, dob: 1, gender: 1 }, { unique: true });
studentSchema.pre('save', async function (next) {
    if (this.studentId)
        return next();
    const year = new Date().getFullYear();
    const prefix = this.name.substring(0, 3).toUpperCase();
    const count = await Student.countDocuments();
    console.log('Count:', count);
    const sequential = String(count + 1).padStart(3, '0');
    this.studentId = `${prefix}/${year}/${sequential}`;
});
studentSchema.pre('save', async function (next) {
    if (this.password)
        return next();
    const dob = new Date(this.dob);
    const dd = String(dob.getUTCDate()).padStart(2, '0');
    const mm = String(dob.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = dob.getUTCFullYear();
    this.password = `${dd}/${mm}/${yyyy}`;
});
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
});
studentSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};
export const Student = mongoose.model('Student', studentSchema);
//# sourceMappingURL=studentModel.js.map