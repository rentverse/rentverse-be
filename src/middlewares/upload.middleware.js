import path from "path";
import multer from "multer";
import status from "http-status";
import { v4 as uuidv4 } from "uuid";

const diskStorage = multer.diskStorage({
  // konfigurasi lokasi penyimpanan file
  destination: function (req, file, cb) {
    cb(null, path.resolve("upload"));
  },
  // konfigurasi penamaan file yang unik
  filename: function (req, file, cb) {
    let fileName = uuidv4();
    cb(null, fileName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: diskStorage,
  // limits: 8192000,
  limits: { fileSize: 8192000 }, // 8Mb
  fileFilter: (req, file, cb) => {
    const allowedMimetype = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];
    if (allowedMimetype.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg, .webp and .jpeg format allowed!"));
    }
  },
});

export const uploadSingleImage = async (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        throw err;
      } else if (err) {
        // An unknown error occurred when uploading.
        throw err;
      }

      // Everything went fine.
      next();
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        status: status.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  });
};

export const uploadMultipleImage = async (req, res, next) => {
  upload.fields([
    {
      name: "images",
    },
  ])(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        throw err;
      } else if (err) {
        // An unknown error occurred when uploading.
        throw err;
      }

      // Everything went fine.
      next();
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        status: status.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  });
};
