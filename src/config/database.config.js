import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
} from "../utils/env.util.js";

export default {
  development: {
    username: DB_USERNAME || "root",
    password: DB_PASSWORD || "password",
    database: DB_NAME || "rentverse_db",
    host: DB_HOST || "127.0.0.1",
    dialect: "postgresql",
  },
  test: {
    username: DB_USERNAME || "root",
    password: DB_PASSWORD || "password",
    database: DB_NAME || "rentverse_db_test",
    host: DB_HOST || "127.0.0.1",
    dialect: "postgresql",
  },
  production: {
    username: DB_USERNAME || "root",
    password: DB_PASSWORD || "password",
    database: DB_NAME || "rentverse_db_prod",
    host: DB_HOST || "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  },
};
