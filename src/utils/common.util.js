import moment from "moment-timezone";
import { TZ } from "./env.util.js";

export const imageUrlGenerator = (req, filename) => {
  if (req.hostname === "localhost" || req.host === "127.0.0.1") {
    return `${req.protocol}://${req.get("host")}/static/${filename}`;
  } else {
    return `https://${req.hostname}/static/${filename}`;
  }
};

export const generateTransactionNumber = () => {
  const prefix = `RENT${moment.tz(TZ).format("YYMMDD")}`; // Format tanggal YYMMDD
  const unixTime = Date.now(); // Waktu saat ini dalam milidetik
  const transactionNumber = `${prefix}${unixTime}`;

  return transactionNumber;
};
