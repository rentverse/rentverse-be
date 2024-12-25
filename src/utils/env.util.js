import process from "process";
import getSecretFromInfisical from "../config/infisical.config.js";
import loadEnv from "../config/dotenv.config.js";

const isSequelizeCli = process.env.SEQUELIZE_CLI;
loadEnv(process.env.NODE_ENV);

let secrets;
if (!isSequelizeCli) {
  secrets = await getSecretFromInfisical();
}

export const DB_HOST = secrets?.DB_HOST || process.env.DB_HOST;
export const DB_PORT = secrets?.DB_PORT || process.env.DB_PORT;
export const DB_NAME = secrets?.DB_NAME || process.env.DB_NAME;
export const DB_USERNAME = secrets?.DB_USERNAME || process.env.DB_USERNAME;
export const DB_PASSWORD = secrets?.DB_PASSWORD || process.env.DB_PASSWORD;

export const JWT_SECRET = secrets?.JWT_SECRET || process.env.JWT_SECRET;
export const API_KEY = secrets?.API_KEY || process.env.API_KEY;

export const TZ = secrets?.TZ || process.env.TZ;
export const PORT = process.env.PORT || 5000;
