import status from "http-status";
import db from "../models/index.js";
import Joi from "joi";
import {
  camelToSnake,
  removeDeletedAt,
  removePassword,
  snakeToCamel,
} from "../utils/format.util.js";
import { convertSequelizeData } from "../utils/sequelize.util.js";
import { Op } from "sequelize";
import { imageUrlGenerator } from "../utils/common.util.js";

const { Item, ItemImage, ItemReview, City, Province, Category, User } = db;

const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  cityId: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  price: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
});

export const createItem = async (req, res) => {
  try {
    // Validasi input
    const { error } = itemSchema.validate(snakeToCamel(req.body));
    if (error) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Membuat item baru
    const newItem = await Item.create(
      {
        ...snakeToCamel(req.body),
        userId: req.authenticatedUser.id,
        ItemImages: req?.files?.images?.map((img) => {
          return {
            imageUrl: imageUrlGenerator(req, img?.filename),
          };
        }),
      },
      {
        include: [{ model: ItemImage }],
      }
    );

    // if (req?.files?.images?.length > 0) {
    //   await Promise.all(
    //     req?.files?.images?.map((img) => {
    //       return ItemImage.create({
    //         itemId: newItem.id,
    //         imageUrl: imageUrlGenerator(req, img?.filename),
    //       });
    //     })
    //   );
    // }

    const addedItem = await Item.findOne({
      where: { id: newItem.id },
      include: [
        {
          model: ItemImage,
        },
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
    });

    return res.status(status.CREATED).json({
      success: true,
      message: "Successfully added new item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(addedItem)))
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

export const getAllItems = async (req, res) => {
  try {
    const { item_name, category_id, city_id, page = 1, limit = 10 } = req.query;

    const where = {};
    if (item_name) {
      where.name = {
        [Op.iLike]: `%${item_name}%`,
      };
    }
    if (city_id) {
      where.cityId = city_id;
    }
    if (category_id) {
      where.categoryId = category_id;
    }

    const itemCount = await Item.count({
      where,
      include: [
        {
          model: ItemImage,
        },
      ],
      // subQuery: false,
      // group: ["Item.id"],
      // distinc: ["Item.id"],
    });
    const items = await Item.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt((page - 1) * limit),
      include: [
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: ItemImage,
        },
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
    });

    return res.status(status.OK).json({
      success: true,
      message: "Successfully get all item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(items)))
      ),
      paging: {
        page: parseInt(page),
        size: parseInt(limit),
        total_item: itemCount,
        total_page: itemCount > 0 ? Math.ceil(itemCount / limit) : 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const { item_name, category_id, city_id, page = 1, limit = 10 } = req.query;

    const where = {
      userId: req?.authenticatedUser?.id,
    };
    if (item_name) {
      where.name = {
        [Op.iLike]: `%${item_name}%`,
      };
    }
    if (city_id) {
      where.cityId = city_id;
    }
    if (category_id) {
      where.categoryId = category_id;
    }

    const itemCount = await Item.count({
      where,
    });
    const items = await Item.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt((page - 1) * limit),
      include: [
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: ItemImage,
        },
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
    });

    return res.status(status.OK).json({
      success: true,
      message: "Successfully get all item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(items)))
      ),
      paging: {
        page: parseInt(page),
        size: parseInt(limit),
        total_item: itemCount,
        total_page: itemCount > 0 ? Math.ceil(itemCount / limit) : 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: Category,
        },
        {
          model: User,
        },
        {
          model: ItemImage,
        },
        {
          model: ItemReview,
        },
      ],
    });

    if (!item) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(status.OK).json({
      success: true,
      message: "Successfully get item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(item)))
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

export const removeItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: ItemImage,
        },
        {
          model: ItemReview,
        },
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
    });

    if (!item) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Item not found",
      });
    }

    if (!item.userId != req?.authenticatedUser?.id) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized, this is not your item",
      });
    }

    await item.destroy();

    return res.status(status.OK).json({
      success: true,
      message: "Successfully remove item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(item)))
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

export const updateItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, stock, price, cityId, categoryId } =
      snakeToCamel(req.body);

    const item = await Item.findByPk(id, {
      include: [
        {
          model: City,
          include: {
            model: Province,
          },
        },
        {
          model: ItemImage,
        },
        {
          model: ItemReview,
        },
        {
          model: Category,
        },
        {
          model: User,
        },
      ],
    });

    if (!item) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Item not found",
      });
    }

    if (!item.userId != req?.authenticatedUser?.id) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized, this is not your item",
      });
    }

    if (name && name != "" && name != item.name) {
      item.name = name;
    }
    if (description && description != "" && description != item.description) {
      item.description = description;
    }
    if (location && location != "" && location != item.location) {
      item.location = location;
    }
    if (stock && stock != "" && stock != item.stock) {
      item.stock = stock;
    }
    if (price && price != "" && price != item.price) {
      item.price = price;
    }
    if (cityId && cityId != "" && cityId != item.cityId) {
      const city = await City.findByPk(cityId);
      if (!city) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: "City not found",
        });
      }
      item.cityId = cityId;
    }
    if (categoryId && categoryId != "" && categoryId != item.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }
      item.categoryId = categoryId;
    }

    const images = req?.files?.images?.map((img) => {
      return {
        itemId: item.id,
        imageUrl: imageUrlGenerator(req, img?.filename),
      };
    });
    if (images?.length > 0) {
      const deletedImageId = [];
      if (item?.ItemImages?.length > 0) {
        deletedImageId.push(...item.ItemImages.map((el) => el.id));
      }
      // console.log("===========DELETE IMAGE===========");
      await ItemImage.destroy({
        where: {
          id: { [Op.in]: deletedImageId },
        },
      });

      // console.log("===========INSERT IMAGE===========");
      await ItemImage.bulkCreate(images);
    }

    await item.save();
    await item.reload();

    return res.status(status.OK).json({
      success: true,
      message: "Successfully update item",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(item)))
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
