import express from 'express';
const authRoute = express.Router();
import { login } from "../controllers/authController.js";
authRoute.post('/login', login);
export default authRoute;
//# sourceMappingURL=authRoute.js.map