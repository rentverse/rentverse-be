import { Router } from "express";
import {
  apiKeyMiddleware,
  jwtMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  addReview,
  checkAvailability,
  createTransaction,
  getIncomingTransactions,
  getOutcomingTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.post(
  "/transactions",
  apiKeyMiddleware,
  jwtMiddleware,
  createTransaction
);
router.get(
  "/transactions/check-availability",
  apiKeyMiddleware,
  jwtMiddleware,
  checkAvailability
);
router.get(
  "/transactions/out",
  apiKeyMiddleware,
  jwtMiddleware,
  getOutcomingTransactions
);
router.get(
  "/transactions/in",
  apiKeyMiddleware,
  jwtMiddleware,
  getIncomingTransactions
);
router.patch(
  "/transactions/:id",
  apiKeyMiddleware,
  jwtMiddleware,
  updateTransaction
);

router.post(
  "/transactions/:id/review",
  apiKeyMiddleware,
  jwtMiddleware,
  addReview
);

export default router;
