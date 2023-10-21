const express=require("express");
const { signup, otp_verfy, login, forgot_password, reset_password } = require("../controller/UserController");
const router=express.Router()

router.post("/signup",signup)
router.post("/otp_verify",otp_verfy)
router.post("/login",login)
router.post("/forgot_password",forgot_password);
router.post("/reset_password",reset_password);


module.exports=router;