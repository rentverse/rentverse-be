import { Router } from "express";
import {
  apiKeyMiddleware,
  jwtMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  checkAuth,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", apiKeyMiddleware, registerUser);
router.post("/login", apiKeyMiddleware, loginUser);
router.get("/check-auth", apiKeyMiddleware, jwtMiddleware, checkAuth);

export default router;
