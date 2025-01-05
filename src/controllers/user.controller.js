import status from "http-status";
import db from "../models/index.js";
import {
  camelToSnake,
  removeDeletedAt,
  removePassword,
} from "../utils/format.util.js";
import { convertSequelizeData } from "../utils/sequelize.util.js";

const { User, City, Province } = db;

export const checkProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.authenticatedUser.id },
      include: [
        {
          model: City,
          include: [{ model: Province }],
        },
      ],
    });
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(status.OK).json({
      success: true,
      message: "Check profile successful.",
      user: camelToSnake(
        removeDeletedAt(removePassword(convertSequelizeData(user)))
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
