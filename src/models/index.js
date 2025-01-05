import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import { Sequelize, DataTypes } from "sequelize";
import databaseConfig from "../config/database.config.js";
import { NODE_ENV } from "../utils/env.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = NODE_ENV || "development";
const dbConfig = databaseConfig[env];
const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

async function loadModels() {
  for (const file of modelFiles) {
    const modelPath = path.join(__dirname, file);
    const model = (await import(`file://${modelPath}`)).default(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
