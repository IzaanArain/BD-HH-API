const mongoose = require("mongoose");
const User = require("../model/UserModel");
const RateReview = require("../model/ReviewsRateModel");
const moment = require("moment");

const rate_review_employee = async (req, res) => {
  try {
    const employer_id = req?.user?._id;
    const { employee_id, rate, review } = req.body;
    if (!employee_id) {
      return res.status(500).send({
        status: 0,
        message: "please enter employee ID",
      });
    } else if (!mongoose.isValidObjectId(employee_id)) {
      return res.status(500).send({
        status: 0,
        message: "not valid employee ID",
      });
    } else if (!rate) {
      return res.status(500).send({
        status: 0,
        message: "please rate employee",
      });
    } else if (parseInt(rate) > 5) {
      return res.status(500).send({
        status: 0,
        message: "rating can not be greater than five",
      });
    }
    const employee = await User.findById(employee_id);
    if (!employee) {
      return res.status(500).send({
        status: 0,
        message: "employee not found",
      });
    }
    const rate_review_exists = await RateReview.findOne({
      employer_id: employer_id,
      employee_id: employee_id,
    });
    if (rate_review_exists) {
      const update_rate_review = await RateReview.findOneAndUpdate(
        { employer_id: employer_id, employee_id: employee_id },
        {
          rate: parseInt(rate),
          review_body: review,
          review_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
        },
        { new: true }
      );
       return res.status(200).send({
        status: 1,
        message: "employer has updated rate and reviewed for employee!",
        rate_review:update_rate_review
      });
    } else {
      const rate_review = await RateReview.create({
        employer_id: employer_id,
        employee_id,
        rate: parseInt(rate),
        review_body: review,
        review_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      return res.status(200).send({
        status: 1,
        message: "rate & review posted successfully",
        rate_review,
      });
    }
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const employee_rate_reviews = async (req, res) => {
  try {
    const employee_id = req?.query?.employee_id;
    if (!employee_id) {
      return res.status(500).send({
        status: 0,
        message: "please enter employee ID",
      });
    } else if (!mongoose.isValidObjectId(employee_id)) {
      return res.status(500).send({
        status: 0,
        message: "not valid employee ID",
      });
    }
    const employee = await User.findById(employee_id);
    if (!employee) {
      return res.status(500).send({
        status: 0,
        message: "employee not found",
      });
    }
    const employee_rate_reviews = await RateReview.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(employee_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "employer_id",
          foreignField: "_id",
          as: "employer",
        },
      },
      {
        $unwind: {
          path: "$employer",
        },
      },
      {
        $addFields: {
          employer_name: "$employer.name",
          employer_image: "$employer.profile_image",
          employer_rate: "$rate",
          employer_review: "$review_body",
          review_date: "$review_date",
        },
      },
      {
        $project: {
          employer_name: 1,
          employer_image: 1,
          employer_rate: 1,
          employer_review: 1,
          review_date: 1,
        },
      },
    ]);

    // const employee_rate_reviews = await User.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(employee_id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "reviewrates",
    //       localField: "_id",
    //       foreignField: "employee_id",
    //       as: "reviews",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "reviews.employer_id",
    //       foreignField: "_id",
    //       as: "employers",
    //     },
    //   },
    // ]);

    return res.status(200).send({
      status: 1,
      message: "got all user reviews",
      employee_rate_reviews,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  rate_review_employee,
  employee_rate_reviews,
};
