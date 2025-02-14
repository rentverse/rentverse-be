import status from "http-status";
import db from "../models/index.js";
import {
  camelToSnake,
  removeDeletedAt,
  removePassword,
  snakeToCamel,
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
      data: camelToSnake(
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

export const updateProfile = async (req, res) => {
  try {
    const { cityId, email, name, phoneNumber, address } = snakeToCamel(
      req.body
    );

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

    // update name
    if (name) {
      user.name = name;
    }

    // update email
    if (email) {
      user.email = email;
      user.isVerified = false;
    }

    // update phone number
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    // update address
    if (address) {
      user.address = address;
    }

    // update city
    if (cityId) {
      const city = await City.findOne({
        where: { id: cityId },
      });

      user.cityId = city.id;
    }

    await user.save();
    await user.reload();

    return res.status(status.OK).json({
      success: true,
      message: "Update profile successful.",
      data: camelToSnake(
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
