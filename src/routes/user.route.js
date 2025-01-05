import { Router } from "express";
import {
  apiKeyMiddleware,
  jwtMiddleware,
} from "../middlewares/auth.middleware.js";
import { checkProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/users/profile", apiKeyMiddleware, jwtMiddleware, checkProfile);

export default router;
