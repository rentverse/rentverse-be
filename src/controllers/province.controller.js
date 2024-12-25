import status from "http-status";
import db from "../models/index.js";
import { Op } from "sequelize";
import { camelToSnake, removeDeletedAt } from "../utils/format.util.js";
import { convertSequelizeData } from "../utils/sequelize.util.js";

const { Province } = db;

export const getAllProvinces = async (req, res) => {
  try {
    const { province_name, limit = 10 } = req.query;

    const where = {};
    if (province_name) {
      where.name = {
        [Op.iLike]: `%${province_name}%`, // find by name
      };
    }

    const provinces = await Province.findAll({
      where,
      limit: parseInt(limit),
    });

    return res.status(status.OK).json({
      success: true,
      data: camelToSnake(removeDeletedAt(convertSequelizeData(provinces))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProvinceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
      });
    }

    const province = await Province.findOne({
      where: { id },
    });

    if (!province) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Province not found",
      });
    }

    return res.status(status.OK).json({
      success: true,
      data: camelToSnake(removeDeletedAt(convertSequelizeData(province))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
