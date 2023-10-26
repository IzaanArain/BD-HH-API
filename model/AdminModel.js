const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
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
    name: {
      type: String,
      default: "",
    },
    is_admin:{
      type: Boolean,
      default: false,
    },
    admin_image:{
      type: String,
      default: "",
    },
    admin_auth: {
      type: String,
      default: "",
    },
    is_forgot_password: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", adminSchema);
