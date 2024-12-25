import fs from "fs";
import process from "process";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import databaseConfig from "../config/database.config.js";

const basename = path.basename(import.meta.url);
const env = process.env.NODE_ENV || "development";
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

const modelFiles = fs.readdirSync(path.resolve("src/models")).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

for (const file of modelFiles) {
  const model = (
    await import(path.join(path.dirname(import.meta.url), file))
  ).default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
