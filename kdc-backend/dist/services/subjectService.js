import Subject from "../models/subjects.js";
import AppError from "../utils/appError.js";
export const createSubject = async function (data) {
    const { name, code } = data;
    const newSubject = await Subject.create({
        name,
        code,
    });
    return newSubject;
};
export const updateSubject = async function (id, data) {
    const updateSchool = await Subject.findById(id);
    if (!updateSchool) {
        throw new AppError('Subject does not exist', 404);
    }
    if (data.name !== undefined)
        updateSchool.name = data.name;
    if (data.code !== undefined)
        updateSchool.code = data.code;
    if (data.isActive !== undefined)
        updateSchool.isActive = data.isActive;
    await updateSchool.save();
    return updateSchool;
};
export const getSubjects = async function (role) {
    if (role === 'admin' || role === 'superAdmin') {
        return await Subject.find();
    }
    else {
        return await Subject.find({ isActive: true });
    }
};
//# sourceMappingURL=subjectService.js.map