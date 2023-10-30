const JobPost = require("../model/JobPostModel");
const User = require("../model/UserModel");
const Notification = require("../model/NotificationModel");
const moment = require("moment");
const mongoose = require("mongoose");

// const create_job_notification = async (req, res) => {
//   try {
//     const employer_id = req?.user?._id;
//     const employee_id = req?.body?.employee_id;
//     const post_id = req?.body?.post_id;
//     if (!employee_id) {
//       return res.status(400).send({
//         status: 0,
//         message: "please enter employee ID",
//       });
//     } else if (!post_id) {
//       return res.status(400).send({
//         status: 0,
//         message: "please enter employee ID",
//       });
//     } else if (!mongoose.isValidObjectId(employee_id)) {
//       return res.status(400).send({
//         status: 0,
//         message: "Not a valid employee ID",
//       });
//     } else if (!mongoose.isValidObjectId(post_id)) {
//       return res.status(400).send({
//         status: 0,
//         message: "Not a valid employee ID",
//       });
//     }
//     const job_post_exists = await JobPost.findById(post_id);
//     const employee_exists = await User.findOne({
//       _id: employee_id,
//       role: "employee",
//     });
//     if (!employee_exists) {
//       return res.status(400).send({
//         status: 0,
//         message: "employee not found",
//       });
//     } else if (!job_post_exists) {
//       return res.status(400).send({
//         status: 0,
//         message: "job post not found",
//       });
//     }
//     const job_assigned = job_post_exists?.is_assigned;
//     if (job_assigned) {
//       return res.status(400).send({
//         status: 0,
//         message: "job post already assigned can not send notification",
//       });
//     }
//     const already_send_nofication = await Notification.findOne({
//       send_id: employer_id,
//       receiver_id: employee_id,
//       job_post_id: post_id,
//     });
//     if (already_send_nofication) {
//       return res.status(400).send({
//         status: 0,
//         message: "Notification already Send for this job post",
//       });
//     }
//     const employee_job_notification = await Notification.create({
//       send_id: employer_id,
//       receiver_id: employee_id,
//       job_post_id: post_id,
//       notification_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
//     });
//     res.status(200).send({
//       status: 1,
//       message: "employee job notification created successfully",
//       employee_job_notification,
//     });
//   } catch (err) {
//     console.error("Error", err.message.red);
//     return res.status(500).send({
//       status: 0,
//       message: "Something went wrong",
//     });
//   }
// };

const employee_job_notifications = async (req, res) => {
  try {
    const employee_id = req?.user?._id;
    console.log(employee_id);
    const job_notifications = await Notification.aggregate([
      {
        $match: {
          receiver_id: employee_id,
        },
      },
      {
        $lookup: {
          from: "jobposts",
          localField: "job_post_id",
          foreignField: "_id",
          as: "job_post",
        },
      },
      {
        $unwind: {
          path: "$job_post",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
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
          job_title: "$job_post.job_title",
          job_description: "$job_post.job_description",
          charges_per_hour: "$job_post.charges_per_hour",
          employer_name: "$employer.name",
          employer_image: "$employer.profile_image",
          campany_name: "$employer.company_name",
          company_image: "$employer.company_image",
          location: "$employer.location",
        },
      },
      {
        $unset: ["job_post", "employer"],
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all job notifications successfully",
      job_notifications,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const employer_notification = async (req, res) => {
  try {
    const employer_id = req?.user?._id;
    const employer_notifications = await Notification.aggregate([
      {
        $match: {
          receiver_id: new mongoose.Types.ObjectId(employer_id),
        },
      },
      {
        $lookup: {
          from: "jobposts",
          localField: "job_post_id",
          foreignField: "_id",
          as: "job_post",
        },
      },
      {
        $unwind: {
          path: "$job_post",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "job_post.employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: {
          path: "$employee",
        },
      },
      {
        $addFields: {
          job_title: "$job_post.job_title",
          job_description: "$job_post.job_description",
          charges_per_hour: "$job_post.charges_per_hour",
          start_time: "$job_post.start_time",
          end_time: "$job_post.end_time",
          employee_name: "$employee.name",
          employee_location: "$employee.location",
          Job_status: "$job_post.job_status",
        },
      },
      {
        $unset: ["job_post", "employee"],
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all employer notifications successfully",
      notifications: employer_notifications,
    });
  } catch {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  employee_job_notifications,
  employer_notification,
};
