import status from "http-status";
import db from "../models/index.js";
import Joi from "joi";
import { convertSequelizeData } from "../utils/sequelize.util.js";
import { Op } from "sequelize";
import {
  camelToSnake,
  removeDeletedAt,
  removePassword,
  snakeToCamel,
} from "../utils/format.util.js";
import moment from "moment-timezone";
import { TZ } from "../utils/env.util.js";
import { generateTransactionNumber } from "../utils/common.util.js";

const {
  Item,
  ItemImage,
  ItemReview,
  City,
  Province,
  Category,
  User,
  Transaction,
  TransactionStatus,
} = db;

const transactionSchema = Joi.object({
  itemId: Joi.number().integer().required(),
  // itemQty: Joi.number().integer().required(),
  // subTotal: Joi.number().integer().required(),
}).unknown(true);

export const createTransaction = async (req, res) => {
  try {
    // Terima input
    const { error } = transactionSchema.validate(snakeToCamel(req.body));
    if (error) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { itemId, itemQty = 1, start, end } = snakeToCamel(req.body);

    // Validasi apakah barang tidak sedang digunakan
    const transactionConflict = await Transaction.findAll({
      where: {
        itemId: itemId,
        [Op.or]: [
          {
            start: {
              [Op.between]: [
                moment.tz(start, TZ).startOf("day"),
                moment.tz(end, TZ).startOf("day"),
              ],
            },
          },
          {
            end: {
              [Op.between]: [
                moment.tz(start, TZ).startOf("day"),
                moment.tz(end, TZ).startOf("day"),
              ],
            },
          },
        ],
        statusId: {
          [Op.notIn]: [2, 4, 6], // Cancel, Rejected, Closed
        },
      },
    });

    const item = await Item.findByPk(itemId);
    if (
      item?.stock - transactionConflict?.length <= 0 ||
      item?.stock - transactionConflict?.length < itemQty
    ) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Item is not available to rent",
      });
    }

    const discount = 0; // to be ini bisa menggunakan discount dari item

    // Generate transaction number
    const transactionNumber = generateTransactionNumber();

    const transaction = await Transaction.create({
      transactionDate: moment.tz(TZ),
      userId: req?.authenticatedUser?.id,
      itemId: itemId,
      itemQty: itemQty,
      subTotal: item?.price * itemQty,
      discount: discount,
      total: item?.price * itemQty - discount,
      statusId: 1, // New
      start: moment.tz(start, TZ),
      end: moment.tz(end, TZ),
      transactionNumber: transactionNumber, // Menyimpan transaction number
    });

    const addedTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Item,
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
        },
        { model: TransactionStatus },
        { model: User },
      ],
    });

    return res.status(status.CREATED).json({
      success: true,
      message: "Successfully added new transaction",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(addedTransaction)))
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

// check availability
export const checkAvailability = async (req, res) => {
  try {
    const { itemId } = req.query;

    const currentDate = moment.tz(TZ);
    const endDate = moment.tz(TZ).add(3, "months");

    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Item not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        itemId: itemId,
        statusId: {
          [Op.notIn]: [2, 4, 6], // Cancel, Rejected, Closed
        },
        [Op.or]: [
          {
            start: {
              [Op.between]: [currentDate, endDate],
            },
          },
          {
            end: {
              [Op.between]: [currentDate, endDate],
            },
          },
        ],
      },
    });

    const unavailableDates = transactions.flatMap((transaction) => {
      const start = moment.tz(transaction.start, TZ);
      const end = moment.tz(transaction.end, TZ);
      const dates = [];
      let date = start.clone();
      while (date <= end) {
        dates.push(date.format("YYYY-MM-DD"));
        date.add(1, "day");
      }
      return dates;
    });

    const availableDates = [];
    let date = currentDate.clone();
    while (date <= endDate) {
      if (!unavailableDates.includes(date.format("YYYY-MM-DD"))) {
        availableDates.push(date.format("YYYY-MM-DD"));
      }
      date.add(1, "day");
    }

    return res.status(status.OK).json({
      success: true,
      message: "Available dates retrieved successfully",
      data: availableDates,
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get history outcoming transaction
export const getOutcomingTransactions = async (req, res) => {
  try {
    const userId = req.authenticatedUser.id;
    const { page = 1, limit = 10 } = req.query;

    const totalTransaction = await Transaction.count({
      where: {
        userId: userId,
      },
    });
    const transactions = await Transaction.findAll({
      where: {
        userId: userId,
      },
      limit: parseInt(limit),
      offset: parseInt((page - 1) * limit),
      include: [
        {
          model: Item,
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
        },
        { model: TransactionStatus },
        { model: User },
      ],
    });

    if (
      totalTransaction != 0 &&
      parseInt(page) != 1 &&
      parseInt(page) > Math.ceil(totalTransaction / limit)
    ) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Out of pages",
      });
    }

    return res.status(status.OK).json({
      success: true,
      message: "Outcoming transactions retrieved successfully",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(transactions)))
      ),
      paging: {
        page: parseInt(page),
        size: parseInt(limit),
        total_item: totalTransaction,
        total_page:
          totalTransaction > 0 ? Math.ceil(totalTransaction / limit) : 1,
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

// get incoming transaction
export const getIncomingTransactions = async (req, res) => {
  try {
    const userId = req.authenticatedUser.id;
    const { page = 1, limit = 10 } = req.query;

    // Cari item yang dimiliki oleh pengguna
    const items = await Item.findAll({
      where: {
        userId: userId,
      },
    });
    const itemIds = items.map((item) => item.id);
    if (itemIds.length === 0) {
      return res.status(status.OK).json({
        success: true,
        message: "No items found",
        data: [],
        paging: {
          page: parseInt(page),
          size: parseInt(limit),
          total_item: 0,
          total_page: 1,
        },
      });
    }

    const totalTransaction = await Transaction.count({
      where: {
        itemId: itemIds,
      },
    });
    const transactions = await Transaction.findAll({
      where: {
        itemId: itemIds,
      },
      limit: parseInt(limit),
      offset: parseInt((page - 1) * limit),
      include: [
        {
          model: Item,
          required: true,
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
        },
        { model: TransactionStatus },
        { model: User },
      ],
    });

    if (
      totalTransaction !== 0 &&
      parseInt(page) !== 1 &&
      parseInt(page) > Math.ceil(totalTransaction / limit)
    ) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Out of pages",
      });
    }

    return res.status(status.OK).json({
      success: true,
      message: "Incoming transactions retrieved successfully",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(transactions)))
      ),
      paging: {
        page: parseInt(page),
        size: parseInt(limit),
        total_item: totalTransaction,
        total_page:
          totalTransaction > 0 ? Math.ceil(totalTransaction / limit) : 1,
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

// update transaction (approve, reject, cancel, on going, closed)
export const updateTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { statusId } = snakeToCamel(req.body);

    console.log("statusId", statusId);

    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        {
          model: Item,
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
        },
        { model: TransactionStatus },
        { model: User },
      ],
    });
    if (!transaction) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Transaction not found",
      });
    }

    switch (parseInt(statusId)) {
      case 2:
        if (req?.authenticatedUser?.id != transaction.userId) {
          return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized, this is not your transaction",
          });
        }
        if (transaction.statusId != 1) {
          return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Cannot cancel transaction if status is not new",
          });
        }
        transaction.statusId = statusId;
        break;
      case 3:
        if (req?.authenticatedUser?.id != transaction?.Item?.userId) {
          return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized, only item's owner allowed for this action",
          });
        }
        if (transaction.statusId != 1) {
          return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Only new transaction that can be change to booked",
          });
        }
        transaction.statusId = statusId;
        break;
      case 4:
        if (req?.authenticatedUser?.id != transaction?.Item?.userId) {
          return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized, only item's owner allowed for this action",
          });
        }
        if (transaction.statusId != 1) {
          return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Only new transaction that can be reject",
          });
        }
        transaction.statusId = statusId;
        break;
      case 5:
        if (req?.authenticatedUser?.id != transaction?.Item?.userId) {
          return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized, only item's owner allowed for this action",
          });
        }
        if (transaction.statusId != 3) {
          return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Only booked transaction that can be change to on going",
          });
        }
        transaction.statusId = statusId;
        break;
      case 6:
        if (req?.authenticatedUser?.id != transaction?.Item?.userId) {
          return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized, only item's owner allowed for this action",
          });
        }
        if (transaction.statusId != 5) {
          return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Only on going transaction that can be closed",
          });
        }
        transaction.statusId = statusId;
        break;

      default:
        return res.status(status.BAD_REQUEST).json({
          success: false,
          message: "Invalid status ID",
        });
    }

    await transaction.save();
    await transaction.reload();

    return res.status(status.OK).json({
      success: true,
      message: "Transaction updated successfully",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(transaction)))
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

// review
export const addReview = async (req, res) => {
  try {
    const { id: transactionId } = snakeToCamel(req.params);
    const { review } = snakeToCamel(req.body);

    // Validasi input
    if (!transactionId || !review) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Transaction ID and review are required",
      });
    }

    // Cek apakah transaksi ada
    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        {
          model: Item,
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
        },
        { model: TransactionStatus },
        { model: User },
      ],
    });

    if (!transaction) {
      return res.status(status.NOT_FOUND).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Cek apakah pengguna adalah pemilik transaksi
    if (req.authenticatedUser.id !== transaction.userId) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized, this is not your transaction",
      });
    }

    // Cek apakah transaksi sudah memiliki review
    const existingReview = await ItemReview.findOne({
      where: {
        transactionId: transactionId,
      },
    });

    if (existingReview) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Review already exists for this transaction",
      });
    }

    // Tambahkan review
    const itemReview = await ItemReview.create({
      itemId: transaction.itemId,
      review: review,
      transactionId: transactionId,
    });

    return res.status(status.CREATED).json({
      success: true,
      message: "Review added successfully",
      data: camelToSnake(
        removePassword(removeDeletedAt(convertSequelizeData(itemReview)))
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
