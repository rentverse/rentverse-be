import { Router } from "express";
import { apiKeyMiddleware } from "../middlewares/auth.middleware.js";
import {
  getAllProvinces,
  getProvinceById,
} from "../controllers/province.controller.js";

const router = Router();

router.get("/provinces", apiKeyMiddleware, getAllProvinces);
router.get("/provinces/:id", apiKeyMiddleware, getProvinceById);

export default router;
