import status from "http-status";
import db from "../models/index.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "process";
import {
  camelToSnake,
  removePassword,
  snakeToCamel,
} from "../utils/format.util.js";
import { convertSequelizeData } from "../utils/sequelize.util.js";

const { User } = db;

// Validation schema
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().min(6).required(), // Min 6 karakter
  city_id: Joi.number().integer().optional(),
  address: Joi.string().optional(),
});
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(), // Min 6 karakter
});

export const registerUser = async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(status.CONFLICT).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      ...snakeToCamel(req.body),
      password: hashedPassword,
    };

    // Create new user
    const newUser = await User.create(userData);

    return res.status(status.CREATED).json({
      success: true,
      data: camelToSnake(removePassword(convertSequelizeData(newUser))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // validate
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // find user
    const user = await User.findOne({
      where: { username: req.body.username },
    });
    if (!user) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // generate jwt
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email }, // payload
      process.env.JWT_SECRET,
      { expiresIn: "1d", issuer: "rentverse" }
    );

    return res.status(status.OK).json({
      success: true,
      message: "Login successful.",
      token,
      user: camelToSnake(removePassword(convertSequelizeData(user))),
    });
  } catch (error) {
    console.error(error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
