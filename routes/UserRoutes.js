const express=require("express");
const { signup, otp_verfy, login } = require("../controller/UserController");
const router=express.Router()

router.post("/signup",signup)
router.post("/otp_verify",otp_verfy)
router.post("/login",login)

module.exports=router;