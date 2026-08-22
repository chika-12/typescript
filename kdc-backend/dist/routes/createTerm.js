import express from 'express';
const termRoute = express.Router();
import { createTermController } from "../controllers/adminTermController.js";
termRoute.post('/', createTermController);
export default termRoute;
//# sourceMappingURL=createTerm.js.map