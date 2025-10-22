const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, // 3MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
    // Specify the two fields you now want to handle
    { name: 'coverImage', maxCount: 1 }, // For the book cover
    { name: 'avatar', maxCount: 1 }      // For the user avatar
]);

module.exports = upload;

// .single is used when we expect just a single field of upload but when they are multiple use fields

// this is called multer configuration that is used when someone uploads it gives that single pic many attributes like destination filename etc etc, run whenever we wnat to upload a pic