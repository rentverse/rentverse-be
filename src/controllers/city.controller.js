import status from "http-status";
import db from "../models/index.js";
import { Op } from "sequelize";
import { camelToSnake, removeDeletedAt } from "../utils/format.util.js";
import { convertSequelizeData } from "../utils/sequelize.util.js";

const { City, Province } = db;

export const getAllCities = async (req, res) => {
  try {
    const { city_name, province_id, province_name, limit = 10 } = req.query;

    const where = {};
    if (city_name) {
      where.name = {
        [Op.iLike]: `%${city_name}%`, // find by city name
      };
    }

    if (province_id) {
      where.provinceId = province_id;
    }

    const cities = await City.findAll({
      where,
      limit: parseInt(limit),
      include: province_name
        ? [
            {
              model: Province,
              where: {
                name: {
                  [Op.iLike]: `%${province_name}%`, // find by province name
                },
              },
              required: true,
            },
          ]
        : [
            {
              model: Province,
              required: true,
            },
          ],
    });

    return res.status(status.OK).json({
      success: true,
      data: camelToSnake(removeDeletedAt(convertSequelizeData(cities))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
      });
    }

    const city = await City.findOne({
      where: { id },
      include: [
        {
          model: Province,
          required: true,
        },
      ],
    });

    if (!city) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(status.OK).json({
      success: true,
      data: camelToSnake(removeDeletedAt(convertSequelizeData(city))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
