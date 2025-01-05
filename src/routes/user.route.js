import { Router } from "express";
import {
  apiKeyMiddleware,
  jwtMiddleware,
} from "../middlewares/auth.middleware.js";
import { checkProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/users/profile", apiKeyMiddleware, jwtMiddleware, checkProfile);
router.patch("/users/profile", apiKeyMiddleware, jwtMiddleware, updateProfile);

export default router;
