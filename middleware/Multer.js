const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profile_image") {
      cb(null, "./uploads/profile_images");
    } else if (file.fieldname === "company_image") {
      cb(null, "./uploads/company_images");
    }
  },
  filename: function (req, file, cb) {
    const fileName =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const imageTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!file) {
      cb(new Error("Image is required!"), false);
    } else if (!imageTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = {
  upload,
};
