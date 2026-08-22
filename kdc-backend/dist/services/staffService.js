import { Staff } from "../models/registration.js";
import AppError from "../utils/appError.js";
import { generateStrongPassword } from "../utils/passwordGenerator.js";
import { staffWelcomeEmail } from "../utils/emailWelcomeMessage.js";
import { sendEmail } from "../utils/emailUtilities.js";
export const signUpStaffs = async function (data) {
    const existingUser = await Staff.findOne({ email: data.email });
    if (existingUser) {
        throw new AppError('Staff with this email already exists', 409);
    }
    const generatedPassword = generateStrongPassword();
    const staff = (await Staff.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'teacher',
        password: generatedPassword,
        phone: data.phone,
        address: data.address,
    }));
    try {
        await sendEmail({
            to: process.env.DEV_EMAIL,
            subject: 'Welcome to KDC School System — Your Login Credentials',
            html: staffWelcomeEmail(data.firstName, staff.employeeId, generatedPassword, staff.role),
        });
    }
    catch (error) {
        await Staff.findByIdAndDelete(staff._id);
        throw new AppError('Failed to send credentials email. Please try again.', 500);
    }
    console.log(`${generatedPassword}`);
    return staff;
};
// Creates admin — superAdmin only
export const signUpAdmin = async function (data) {
    const existingUser = await Staff.findOne({ email: data.email });
    if (existingUser) {
        throw new AppError('Staff with this email already exists', 409);
    }
    const generatedPassword = generateStrongPassword();
    const admin = (await Staff.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'admin',
        password: generatedPassword,
        phone: data.phone,
        address: data.address,
    }));
    try {
        await sendEmail({
            to: data.email,
            subject: 'Welcome to KDC School System — Your Admin Credentials',
            html: staffWelcomeEmail(data.firstName, admin.employeeId, generatedPassword, admin.role),
        });
    }
    catch (error) {
        await Staff.findByIdAndDelete(admin._id);
        throw new AppError('Failed to send credentials email. Please try again.', 500);
    }
    return admin;
};
export const updateStaffService = async (id, data, requesterRole) => {
    const staff = (await Staff.findById(id));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    // Admin cannot update another admin or superAdmin
    if (requesterRole === 'admin' &&
        (staff.role === 'admin' || staff.role === 'superAdmin')) {
        throw new AppError('You do not have permission to update this user', 403);
    }
    // Nobody can update superAdmin except superAdmin
    if (staff.role === 'superAdmin' && requesterRole !== 'superAdmin') {
        throw new AppError('You do not have permission to update this user', 403);
    }
    // Strip fields that should never be updated directly
    const { password, role, employeeId, ...safeData } = data;
    const updated = (await Staff.findByIdAndUpdate(id, { $set: safeData }, { new: true, runValidators: true }));
    return updated;
};
export const deactivateStaffService = async (id, requesterRole) => {
    const staff = (await Staff.findById(id));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    // Admin cannot deactivate another admin or superAdmin
    if (requesterRole === 'admin' &&
        (staff.role === 'admin' || staff.role === 'superAdmin')) {
        throw new AppError('You do not have permission to deactivate this user', 403);
    }
    // Nobody can deactivate superAdmin
    if (staff.role === 'superAdmin') {
        throw new AppError('superAdmin account cannot be deactivated', 403);
    }
    await Staff.findByIdAndUpdate(id, { $set: { isActive: false } });
};
export const reactivateStaffService = async (id, requesterRole) => {
    // Use findOne without the isActive filter to find inactive staff
    const staff = (await Staff.findOneAndUpdate({ _id: id }, { $set: { isActive: true } }, { new: true }));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    if (requesterRole === 'admin' &&
        (staff.role === 'admin' || staff.role === 'superAdmin')) {
        throw new AppError('You do not have permission to reactivate this user', 403);
    }
    return staff;
};
export const upgradeToAdminService = async (id, requesterRole) => {
    if (requesterRole !== 'superAdmin') {
        throw new AppError('Only superAdmin can upgrade a teacher to admin', 403);
    }
    const staff = (await Staff.findById(id));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    if (staff.role !== 'teacher') {
        throw new AppError('Only teachers can be upgraded to admin', 400);
    }
    const updated = (await Staff.findByIdAndUpdate(id, { $set: { role: 'admin' } }, { new: true }));
    return updated;
};
export const removeAdminService = async (id, requesterRole) => {
    if (requesterRole !== 'superAdmin') {
        throw new AppError('Only superAdmin can remove admin privileges', 403);
    }
    const staff = (await Staff.findById(id));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    if (staff.role !== 'admin') {
        throw new AppError('This user is not an admin', 400);
    }
    const updated = (await Staff.findByIdAndUpdate(id, { $set: { role: 'teacher' } }, { new: true }));
    return updated;
};
export const getAllStaffService = async (requesterRole) => {
    const staff = await Staff.find();
    // Admin cannot see superAdmin
    if (requesterRole === 'admin') {
        return staff.filter((s) => s.role !== 'superAdmin');
    }
    return staff;
};
export const getOneStaffService = async (id, requesterRole) => {
    const staff = (await Staff.findById(id));
    if (!staff) {
        throw new AppError('Staff not found', 404);
    }
    if (requesterRole === 'admin' && staff.role === 'superAdmin') {
        throw new AppError('You do not have permission to view this user', 403);
    }
    return staff;
};
//# sourceMappingURL=staffService.js.map