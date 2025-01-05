import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { routerV1 } from "./routes/index.js";
import {
  CORS_HEADER,
  CORS_METHOD,
  CORS_ORIGIN,
  NODE_ENV,
  PORT,
} from "./utils/env.util.js";

// create instance of express
const app = express();

// cors configuration
app.use(
  cors({
    origin: CORS_ORIGIN.split(","),
    methods: CORS_METHOD.split(","),
    allowedHeaders: CORS_HEADER.split(","),
  })
);

// create logger instance
const morganFormat = NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// incoming request parser
app.use(express.json());

// create router
app.use("/api/v1/", routerV1);

// serving static files
app.use("/static", express.static(path.resolve("uploads")));

// get port from environment variable, if not exist then use default port 5000
const port = PORT;

// run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
