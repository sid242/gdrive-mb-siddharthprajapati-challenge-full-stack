import { Router } from "express";
import { accessDriveFiles } from "../controllers/gdrive.controller.js";
import { authenticateUser } from "../middlewares/authenticate.middleware.js";

const router = Router();

router.route("/").post(authenticateUser, accessDriveFiles);

export default router;
