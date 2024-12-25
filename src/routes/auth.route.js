import { Router } from "express";
import { apiKeyMiddleware } from "../middlewares/auth.middleware.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", apiKeyMiddleware, registerUser);
router.post("/login", apiKeyMiddleware, loginUser);

export default router;
