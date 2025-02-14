import { Router } from "express";
import {
  apiKeyMiddleware,
  jwtMiddleware,
} from "../middlewares/auth.middleware.js";
import { uploadMultipleImage } from "../middlewares/upload.middleware.js";
import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  removeItemById,
  updateItemById,
} from "../controllers/item.controller.js";

const router = Router();

router.post(
  "/items",
  apiKeyMiddleware,
  jwtMiddleware,
  uploadMultipleImage,
  createItem
);
router.get("/items", apiKeyMiddleware, jwtMiddleware, getAllItems);
router.get("/items/owned", apiKeyMiddleware, jwtMiddleware, getMyItems);
router.get("/items/:id", apiKeyMiddleware, jwtMiddleware, getItemById);
router.delete("/items/:id", apiKeyMiddleware, jwtMiddleware, removeItemById);
router.patch(
  "/items/:id",
  apiKeyMiddleware,
  jwtMiddleware,
  uploadMultipleImage,
  updateItemById
);

export default router;
