import { configDotenv } from "dotenv";
import process from "process";

const loadEnv = (env) => {
  switch (env) {
    case "development":
      // dev
      try {
        configDotenv({ path: `${process.cwd()}/.env.development.local` });
      } catch (error) {
        console.log(
          "Error loading environment variables file, the apps will read global environtment variabels on this system"
        );
        console.error("error >>>", error);
      }

      console.log("=== using development environment ===");
      break;

    case "production":
      // prod
      try {
        configDotenv({ path: `${process.cwd()}/.env.production.local` });
      } catch (error) {
        console.log(
          "Error loading environment variables file, the apps will read global environtment variabels on this system"
        );
        console.error("error >>>", error);
      }

      console.log("=== using production environment ===");
      break;

    default:
      console.log(
        "=== the apps will read global environtment variabels on this system ==="
      );
      break;
  }
};

export default loadEnv;
