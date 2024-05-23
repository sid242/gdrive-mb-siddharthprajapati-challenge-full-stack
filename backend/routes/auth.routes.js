import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authenticate.middleware.js";
const router = Router();

router.route("/google/login").post(login);
router.route("/logout").post(authenticateUser, logout);

export default router;
