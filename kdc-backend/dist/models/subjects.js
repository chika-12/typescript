import mongoose from 'mongoose';
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
subjectSchema.pre('save', async function (next) {
    const name = this.name.split(' ');
    const newName = name.map((word) => {
        const firstChar = word.slice(0, 1);
        return firstChar.toUpperCase() + word.slice(1).toLocaleLowerCase();
    });
    this.name = newName.join(' ');
    this.code = this.code.toUpperCase();
});
const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
//# sourceMappingURL=subjects.js.map