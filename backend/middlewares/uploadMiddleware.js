// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');


// // Create uploads directory if it doesn't exist
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3000000 }, // 3MB limit
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).fields([
//     // Specify the two fields you now want to handle
//     { name: 'coverImage', maxCount: 1 }, // For the book cover
//     { name: 'avatar', maxCount: 1 }      // For the user avatar
// ]);

// module.exports = upload;

// .single is used when we expect just a single field of upload but when they are multiple use fields

// this is called multer configuration that is used when someone uploads it gives that single pic many attributes like destination filename etc etc, run whenever we wnat to upload a pic







// the above is multer configuration when i am saving stuf on upload folder in the laptop below i am writing for cloudinary



const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Use memoryStorage so files stay in memory only
const storage = multer.memoryStorage();

// Validate file types (only images)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) cb(null, true);
  else cb('Error: Images Only!');
}

//  Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => checkFileType(file, cb),
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);

// Convert file buffer to Cloudinary upload (no streamifier)
const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    // cloudinary supports uploading base64 directly — simple & no fs
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    cloudinary.uploader
      .upload(base64String, { folder })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

// Middleware function
const handleUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err });

    try {
      const results = {};

      if (req.files?.coverImage) {
        const result = await uploadToCloudinary(req.files.coverImage[0], 'covers');
        results.coverImage = result.secure_url;
      }

      if (req.files?.avatar) {
        const result = await uploadToCloudinary(req.files.avatar[0], 'avatars');
        results.avatar = result.secure_url;
      }

      req.uploadedFiles = results;      //in our req we are adding a new feld on server side which includes coverImage and avatar
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
    }
  });
};

module.exports = handleUpload;
