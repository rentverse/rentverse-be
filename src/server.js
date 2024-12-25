import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import process from "process";
import loadEnv from "./config/dotenv.config.js";
import { routerV1 } from "./routes/index.js";

loadEnv(process.env.NODE_ENV);

// create instance of express
const app = express();

// cors configuration
app.use(
  cors({
    origin: process.env.ORIGIN_ALLOWED,
    methods: ["HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);

// create logger instance
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// incoming request parser
app.use(express.json());

// create router
app.use("/api/v1/", routerV1);

// serving static files
app.use("/static", express.static(path.resolve("uploads")));

// get port from environment variable, if not exist then use default port 5000
const port = process.env.PORT || 5000;

// run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
