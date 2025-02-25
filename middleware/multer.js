const multer = require('multer');
const { AppError } = require("../utils/error_handler");

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Generate a unique filename + the extension
    const uniqueSuffix =  Math.round(Math.random() * 1E9) + '.' + file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${uniqueSuffix}`);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } ,

  fileFilter: (req, file, cb) => {

    // Validate image file types
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new AppError(400, 'Only JPEG and PNG images are allowed'));
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return cb(new AppError(400, 'File size exceeds the limit of 5MB'));
    }

    cb(null, true);
  },
}).any();

const upload_scrap = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } ,

  fileFilter: (req, file, cb) => {

    // Validate image file types
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new AppError(400, 'Only PDF Files are allowed'));
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return cb(new AppError(400, 'File size exceeds the limit of 5MB'));
    }

    cb(null, true);
  },
}).single('scrap_file');


// handle errors and send response
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("err => ", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

const upload_scrap_middleware = (req, res, next) => {
  upload_scrap(req, res, (err) => {

    if (err) {
      return res.status(400).json({ error: err.message });
    }

    next();
  });
}


exports.upload = uploadMiddleware;
exports.upload_scrap = upload_scrap_middleware;