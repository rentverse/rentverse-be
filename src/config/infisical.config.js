import { InfisicalSDK } from "@infisical/sdk";
import process from "process";

const getSecretFromInfisical = async () => {
  try {
    const client = new InfisicalSDK();

    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET,
    });

    const allSecrets = await client.secrets().listSecrets({
      environment: "dev", // stg, dev, prod, or custom environment slugs
      projectId: "37e32500-0911-499c-b1af-1281b18f36d7",
      secretPath: "/servant_report",
    });

    const secrets = {};
    allSecrets.secrets.forEach((el) => {
      secrets[el.secretKey] = el.secretValue;
    });

    return secrets;
  } catch (error) {
    console.error("Failed connect to infisical !");
    console.error("Error >>>", error);
  }
};

export default getSecretFromInfisical;
