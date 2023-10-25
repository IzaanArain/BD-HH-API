const User = require("../model/UserModel");
const JobPost = require("../model/JobPostModel");
const moment = require("moment");
const mongoose = require("mongoose");
const ApplyJob = require("../model/AppliedJobPostModel");

const create_job_post = async (req, res) => {
  try {
    const employer_id = req?.user?._id;
    const {
      job_title,
      job_description,
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
    } else if (!job_description) {
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
    const total_hours = date2.diff(date1, "hours");
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
    const post_image = req?.files?.post_image;
    const post_image_path = post_image
      ? post_image[0]?.path?.replace(/\\/g, "/")
      : null;
    const job_post = await JobPost.create({
      job_title,
      job_description,
      charges_per_hour,
      total_hours,
      start_time: date1.format("MMMM Do YYYY, h:mm:ss a"),
      end_time: date2.format("MMMM Do YYYY, h:mm:ss a"),
      post_date: current_date.format("MMMM Do YYYY, h:mm:ss a"),
      job_post_image: post_image_path,
      location,
      employer_id: employer_id,
    });
    return res.status(200).send({
      status: 1,
      message: "job post created successfully",
      job_post,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const apply_job = async (req, res) => {
  try {
    const user_id = req.user._id;
    const post_id = req.query.post_id;
    if (!post_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter post ID",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid employee ID",
      });
    }
    const job_post = await JobPost.findById(post_id);
    if (!job_post) {
      return res.status(400).send({
        status: 0,
        message: "job post not found",
      });
    }
    const already_applied = await ApplyJob.findOne({
      job_post_id: post_id,
      user_id: user_id,
    });
    if (already_applied) {
      return res.status(400).send({
        status: 0,
        message: "user has already applied",
      });
    } else {
      const applied_user = await ApplyJob.create({
        user_id: user_id,
        job_post_id: post_id,
        is_applied: true,
        applied_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      });
      return res.status(400).send({
        status: 0,
        message: "employee has succesfully applied for job",
        applied_user: applied_user,
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

const assign_job = async (req, res) => {
  try {
    const { employee_id, post_id } = req.body;
    if (!employee_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter employee ID",
      });
    } else if (!post_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter post ID",
      });
    } else if (!mongoose.isValidObjectId(employee_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid employee ID",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid employee ID",
      });
    }
    const employee = await User.findById(employee_id);
    if (!employee) {
      return res.status(400).send({
        status: 0,
        message: "employee not found",
      });
    }
    const employee_role = employee?.role;
    if (employee_role !== "employee") {
      return res.status(400).send({
        status: 0,
        message: "user is not a employee",
      });
    }
    const job_post = await JobPost.findById(post_id);
    if (!job_post) {
      return res.status(400).send({
        status: 0,
        message: "job post not found",
      });
    }
    const job_assigned = req?.user?.is_assigned;
    if (job_assigned) {
      return res.status(400).send({
        status: 0,
        message: "job already assigned",
      });
    }
    const assigned_job = await JobPost.findByIdAndUpdate(
      post_id,
      {
        employee_id: employee_id,
        job_status: "Assigned",
        is_assigned: true,
        assigned_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "job post assigned successfully",
      job_post: assigned_job,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const accept_job = async (req, res) => {
  try {
    const employee_id = req?.user?._id;
    const post_id = req.query.post_id;
    if (!post_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter post ID",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid employee ID",
      });
    }
    const job_post = await JobPost.findById(post_id);
    if (!job_post) {
      return res.status(400).send({
        status: 0,
        message: "job post not found",
      });
    }
    const job_assigned = job_post?.is_assigned;
    if (!job_assigned) {
      return res.status(400).send({
        status: 0,
        message: "job post not assigned yet",
      });
    }
    const job_employee_id = job_post?.employee_id;
    if (job_employee_id.toString() !== employee_id.toString()) {
      return res.status(400).send({
        status: 0,
        message: "job not assigned to this employee",
      });
    }
    const accepted_job = await JobPost.findByIdAndUpdate(
      post_id,
      {
        job_status: "Accepted",
        is_accepted: true,
        accepted_date: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "Job accepted successfully!",
      job_post: accepted_job,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const get_job_post = async (req, res) => {
  try {
    const post_id = req.query.post_id;
    if (!post_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter post ID",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid post ID",
      });
    }
    const job_post_exists = await JobPost.findById(post_id);
    if (!job_post_exists) {
      return res.status(400).send({
        status: 0,
        message: "job post not found",
      });
    }
    const job_accepted = job_post_exists?.is_accepted;
    if (job_accepted) {
      const job_post = await JobPost.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(post_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "employee_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
          },
        },
        {
          $addFields: {
            employee_name: "$user.name",
            employee_email: "$user.email",
            employee_phone: "$user.phone_number",
            industry_category: "$user.industry_category",
            employee_location: "$user.location",
            employee_image: "$user.profile_image",
          },
        },
        {
          $unset: ["user"],
        },
      ]);
      return res.status(200).send({
        status: 0,
        message: "fetched job post successfully",
        job_post,
      });
    } else {
      const job_post = await JobPost.findById(post_id);
      return res.status(200).send({
        status: 0,
        message: "fetched job post successfully",
        job_post,
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

// employee home page
const employee_job_posts = async (req, res) => {
  try {
    const job_posts = await JobPost.aggregate([
      {
        $match: {
          job_status: "Waiting Applicant",
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
          company_name: "$employer.company_name",
          company_image: "$employer.company_image",
          company_location: "$employer.location",
        },
      },
      {
        $unset: ["employer"],
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all job posts",
      job_posts,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

// employer home page
const employer_job_posts = async (req, res) => {
  try {
    const employer_id = req?.user?._id;
    const job_posts = await JobPost.aggregate([
      {
        $match: {
          employer_id: new mongoose.Types.ObjectId(employer_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: {
          path: "$employee",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          employee_name: "$employee.name",
          employee_image: "$employee.profile_image",
          employee_location: "$employee.location",
        },
      },
      {
        $unset: ["employee"],
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all job posts successfully",
      job_posts,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

// employee calender page
const get_accepted_posts = async (req, res) => {
  try {
    const employee_id = req.user._id;
    const accepted_posts = await JobPost.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(employee_id),
          job_status: "Accepted",
        },
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all accepted job posts successfully",
      job_posts: accepted_posts,
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const applicant_job_posts = async (req, res) => {
  try {
    const job_applicants = await JobPost.aggregate([
      {
        $match: {
          job_status: "Waiting Applicant",
        },
      },
      {
        $lookup: {
          from: "appliedjobposts",
          localField: "_id",
          foreignField: "job_post_id",
          as: "applicants",
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
          company_name: "$employer.company_name",
          company_image: "$employer.company_image",
          company_location: "$employer.location",
          applicants_count: {
            $size: "$applicants",
          },
        },
      },
      {
        $unset: ["applicants", "employer"],
      },
    ]);
    return res.status(200).send({
      status: 1,
      message: "fetched all job posts",
      job_posts:job_applicants
    })
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};
const job_applicants=async(req,res)=>{
  try{
    const post_id=req.query.post_id;

  }catch(err){
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
}

const edit_job_post = async (req, res) => {
  try {
    const {
      post_id,
      job_title,
      job_description,
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
    } else if (!job_description) {
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
    } else if (!post_id) {
      return res.status(400).send({
        status: 0,
        message: "please enter post ID",
      });
    } else if (!mongoose.isValidObjectId(post_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid post ID",
      });
    }
    const job_post_exists = await JobPost.findById(post_id);
    if (!job_post_exists) {
      return res.status(400).send({
        status: 0,
        message: "job post not found",
      });
    }
    const current_date = moment(Date.now());
    const date1 = moment(start_time);
    const date2 = moment(end_time);
    const total_hours = date2.diff(date1, "hours");
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
    const post_image = req?.files?.post_image;
    const post_image_path = post_image
      ? post_image[0]?.path?.replace(/\\/g, "/")
      : null;
    const edited_post = await JobPost.findByIdAndUpdate(
      post_id,
      {
        job_title,
        job_description,
        charges_per_hour,
        total_hours,
        start_time: date1.format("MMMM Do YYYY, h:mm:ss a"),
        end_time: date2.format("MMMM Do YYYY, h:mm:ss a"),
        post_date: current_date.format("MMMM Do YYYY, h:mm:ss a"),
        job_post_image: post_image_path,
        location,
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "job post has been successfully edited",
      job_posts: edited_post,
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
  create_job_post,   
  apply_job,
  assign_job,
  accept_job,
  get_job_post,
  employee_job_posts,
  employer_job_posts,
  get_accepted_posts,
  edit_job_post,
};
