import mongoose, { Schema, Types } from 'mongoose';
const QuestionSchema = new Schema({
    exam: { type: Types.ObjectId, ref: 'Exam', required: true },
    questionText: { type: String, required: true },
    options: {
        type: [
            {
                label: { type: String, required: true },
                text: { type: String, required: true },
            },
        ],
        validate: {
            validator: (v) => v.length === 4,
            message: 'Options must contain exactly 4 items',
        },
        required: true,
    },
    correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
}, { timestamps: true });
export const Question = mongoose.model('Question', QuestionSchema);
//# sourceMappingURL=questions.js.map