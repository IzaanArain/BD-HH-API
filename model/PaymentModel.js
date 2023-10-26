const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    job_post_id: {
      types: mongoose.Types.ObjectId,
      ref: "jobPost",
      default: null,
    },
    employee_id: {
      types: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    employer_id: {
      types: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    card_id: {
      type: mongoose.Types.ObjectId,
      ref: "card",
    },
    paid_amount: {
      type: Number,
      default: null,
    },
    payment_date: {
      type: String,
      default: "",
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", paymentSchema);
