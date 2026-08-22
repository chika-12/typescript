import mongoose, { Schema } from 'mongoose';
const classSubjectSchema = new mongoose.Schema({
    class: {
        type: String,
        enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
        required: true,
    },
    term: {
        type: Schema.Types.ObjectId,
        ref: 'Term',
        required: true,
    },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
});
classSubjectSchema.index({ class: 1, term: 1 }, { unique: true });
const ClassSubject = mongoose.model('ClassSubject', classSubjectSchema);
export default ClassSubject;
//# sourceMappingURL=classSubjects.js.map