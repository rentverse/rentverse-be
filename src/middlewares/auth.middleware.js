import loadEnv from "../config/dotenv.config.js";
import process from "process";
import status from "http-status";
import jwt from "jsonwebtoken";

loadEnv(process.env.NODE_ENV);

export const apiKeyMiddleware = (req, res, next) => {
  try {
    // get api key from header
    const apiKey = req.headers["x-api-key"];

    // check is api key exist and valid
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(status.UNAUTHORIZED).json({
        message: "Unauthorized: Invalid API key",
      });
    }

    next();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(status.UNAUTHORIZED).json({
        status: status.UNAUTHORIZED,
        message: "Token not found",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return res.status(status.UNAUTHORIZED).json({
          status: status.UNAUTHORIZED,
          message: "Invalid token",
        });
      }

      req.authenticatedUser = payload;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
};
