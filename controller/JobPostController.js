const User = require("../model/UserModel");
const JobPost = require("../model/JobPostModel");
const moment = require("moment");

const create_job_post = async (req, res) => {
  try {
    const employer_id=req?.user?._id;
    const {
      job_title,
      Job_description,
      charges_per_hour,
      start_time,
      end_time,
      location,
    } = req.body;
    if (!job_title) {
      return res.status(500).send({
        status: 0,
        message: "please enter title",
      });
    } else if (!Job_description) {
      return res.status(500).send({
        status: 0,
        message: "please enter description",
      });
    } else if (!charges_per_hour) {
      return res.status(500).send({
        status: 0,
        message: "please enter charges per hour",
      });
    } else if (!start_time) {
      return res.status(500).send({
        status: 0,
        message: "please enter start time",
      });
    } else if (!end_time) {
      return res.status(500).send({
        status: 0,
        message: "please enter en time",
      });
    } else if (!location) {
      return res.status(500).send({
        status: 0,
        message: "please enter title",
      });
    }
    const current_date = moment(Date.now());
    const date1 = moment(start_time);
    const date2 = moment(end_time);
    if (date1.isBefore(current_date)) {
      res.status(400).send({
        status: 0,
        message: "start date can not be before current date",
      });
    } else if (date2.isBefore(date1)) {
      res.status(400).send({
        status: 0,
        message: "end date can not be before start date",
      });
    } else if (date1.isAfter(date2)) {
      res.status(400).send({
        status: 0,
        message: "start date can not be after end date",
      });
    }
    const job_post = await JobPost.create({
      job_title,
      Job_description,
      charges_per_hour,
      start_time: date1.format("MMMM Do YYYY, h:mm:ss a"),
      end_time: date2.format("MMMM Do YYYY, h:mm:ss a"),
      post_date:current_date.format("MMMM Do YYYY, h:mm:ss a"),
      location,
      employer_id:employer_id
    });
    return res.status(200).send({
      status: 1,
      message: "job post created successfully",
      job_post,
    });
  } catch {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  create_job_post,
};
