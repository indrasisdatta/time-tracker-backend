import multer, { diskStorage } from "multer";

const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_FOLDER!);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/").pop();
    const filename = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

export const multerConfig = multer({
  storage,
  limits: {
    fileSize: Number(process.env.FILE_UPLOAD_SIZE_LIMIT) * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error(`Invalid file type. Only jpg, png, jpeg files are allowed`)
      );
    }
    cb(null, true);
  },
});
