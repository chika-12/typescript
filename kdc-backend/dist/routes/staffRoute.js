import express from 'express';
import { signUpStaffsControler, signUpAdminController, updateStaffController, deactivateStaffController, reactivateStaffController, upgradeToAdminController, removeAdminController, getAllStaffController, getOneStaffController, } from "../controllers/staffControllers.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
const staffRoute = express.Router();
// All routes below require login
staffRoute.use(protect);
// Create
staffRoute.post('/signup', restrictTo('admin', 'superAdmin'), signUpStaffsControler);
staffRoute.post('/signup-admin', restrictTo('superAdmin'), signUpAdminController);
// Read
staffRoute.get('/', restrictTo('admin', 'superAdmin'), getAllStaffController);
staffRoute.get('/:id', restrictTo('admin', 'superAdmin'), getOneStaffController);
// Update
staffRoute.patch('/:id', restrictTo('admin', 'superAdmin'), updateStaffController);
// Deactivate and reactivate
staffRoute.patch('/:id/deactivate', restrictTo('admin', 'superAdmin'), deactivateStaffController);
staffRoute.patch('/:id/reactivate', restrictTo('admin', 'superAdmin'), reactivateStaffController);
// Role management — superAdmin only
staffRoute.patch('/:id/upgrade-to-admin', restrictTo('superAdmin'), upgradeToAdminController);
staffRoute.patch('/:id/remove-admin', restrictTo('superAdmin'), removeAdminController);
export default staffRoute;
//# sourceMappingURL=staffRoute.js.map