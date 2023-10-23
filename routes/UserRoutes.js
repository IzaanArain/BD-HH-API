const express = require("express");
const {
  signup,
  otp_verfy,
  login,
  forgot_password,
  reset_password,
  complete_profile,
  change_password,
  delete_profile
} = require("../controller/UserController");
const { user_validate_token } = require("../middleware/Auth");
const router = express.Router();

router.post("/signup", signup);
router.post("/otp_verify", otp_verfy);
router.post("/login", login);
router.post("/forgot_password", forgot_password);
router.post("/reset_password", reset_password);
router.post("/complete_profile", user_validate_token, complete_profile);
router.post("/change_password", user_validate_token, change_password);
router.post("/delete_profile", user_validate_token,delete_profile);

module.exports = router;
