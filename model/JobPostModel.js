const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobPostSchema = new Schema(
  {
    job_title: {
      type: String,
      default: "",
    },
    job_description: {
      type: String,
      default: "",
    },
    charges_per_hour: {
      type: Number,
      default: null,
    },
    total_hours: {
      type: Number,
      default: null,
    },
    start_time: {
      type: String,
      default: "",
    },
    end_time: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    post_date: {
      type: String,
      default: "",
    },
    job_status: {
      type: String,
      enum: [
        "Waiting Applicant",
        "Assigned",
        "Accepted",
        "In Progress",
        "Completed",
      ],
      default: "Waiting Applicant",
    },
    job_post_image: {
      type: String,
      default: "",
    },
    employer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    is_assigned: {
      type: Boolean,
      default: false,
    },
    assigned_date: {
      type: String,
      default: "",
    },
    is_accepted: {
      type: Boolean,
      default: false,
    },
    accepted_date: {
      type: String,
      default: "",
    },
    job_completed: {
      type: Boolean,
      default: false,
    },
    user_completion_date: {
      type: String,
      default: "",
    },
    paid_amount: {
      type: Number,
      default: null,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("jobPost", jobPostSchema);
