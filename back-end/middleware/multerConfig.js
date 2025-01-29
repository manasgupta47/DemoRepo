const multer = require('multer');
const constant = require('../utilities/constant');  // Import constants if needed

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: constant.image_size },  // Use a constant for file size: ;
  fileFilter: (req, file, cb) => {
    if (constant.image_types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(constant.image_upload_err), false);
    }
  }
});

module.exports = upload;
