import { Router } from "express";
import { apiKeyMiddleware } from "../middlewares/auth.middleware.js";
import { getAllCities, getCityById } from "../controllers/city.controller.js";

const router = Router();

router.get("/cities", apiKeyMiddleware, getAllCities);
router.get("/cities/:id", apiKeyMiddleware, getCityById);

export default router;
