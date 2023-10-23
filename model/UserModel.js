const mongoose = require("mongoose");
const { Schema } = mongoose;

const userScehma = new Schema(
  {
    email: {
      type: String,
      default: "",
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["employee", "employer"],
      default: "employee",
    },
    name: {
      type: String,
      default: "",
    },
    company_name: {
      type: String,
      default: "",
    },
    phone_number: {
      type: Number,
      default: null,
    },
    business_number: {
      type: Number,
      default: null,
    },
    industry_category: {
      type:String,
      default:""
    },
    location: {
      type: String,
      default: "",
    },
    user_image: {
      type: String,
      default: "",
    },
    company_image:{
      type: String,
      default: "",
    },
    otp_code: {
      type: Number,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    user_auth: {
      type: String,
      default: "",
    },
    is_complete: {
      type: Boolean,
      default: false,
    },
    job_request: {
      type: Boolean,
      default: false,
    },
    is_notification:{
      type: Boolean,
      default: false,
    },
    is_forgot_password: {
      type: Boolean,
      default: false,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
    device_token: {
      type: String,
      default: "123456789",
    },
    device_type: {
      type: String,
      default: "Android",
    },
    social_token: {
      type: String,
      default: "987654321",
    },
    social_type: {
      type: String,
      default: "facebook",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userScehma);
