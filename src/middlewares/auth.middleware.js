import loadEnv from "../config/dotenv.config.js";
import process from "process";
import status from "http-status";

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
    console.log(req.body);
    next();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};
