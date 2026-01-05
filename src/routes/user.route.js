// Imports.
import express from "express";
import * as userController from "../controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../../utils/cloudinary.js";
const router = express.Router();

router.post("/register", upload.single("image"), userController.register);
router.post("/login", userController.login);
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, upload.single("image"), userController.updateProfile);

export default router;
