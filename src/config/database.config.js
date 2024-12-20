import loadEnv from "./dotenv.config.js";
import process from "process";

loadEnv(process.env.NODE_ENV);

export default {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "rentverse_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgresql",
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "rentverse_db_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgresql",
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "rentverse_db_prod",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgresql",
  },
};
