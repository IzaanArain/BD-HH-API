const { create_token } = require("../middleware/Auth");
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password, role } = req.body;
    const roles = ["employee", "employer"];
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    } else if (!role) {
      return res.status(400).send({
        status: 0,
        message: "must have role!",
      });
    } else if (!roles.includes(role)) {
      return res.status(400).send({
        status: 0,
        message: "role can either be employer or employee",
      });
    }
    const userExists = await User.findOne({ email: typed_email });
    if (userExists) {
      return res.status(400).send({
        status: 0,
        message: "user has already signed Up",
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(typed_password, salt);
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;

    const user = await User.create({
      email: typed_email,
      password: hashedPassword,
      otp_code: gen_otp_code,
      role,
    });
    return res.status(200).send({
      status: 1,
      message: "signUp successful",
      user: user,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const otp_verfy = async (req, res) => {
  try {
    const { email: typed_email, otp_code: typed_otp_code } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_otp_code) {
      return res.status(400).send({
        status: 0,
        message: "please enter OTP code",
      });
    } else if (typed_otp_code.length !== 6) {
      return res.status(400).send({
        status: 0,
        message: "OTP code must be of six digits",
      });
    } else if (!typed_otp_code.match(/^[0-9]*$/)) {
      return res.status(400).send({
        status: 0,
        message: "OTP code consists of numbers only",
      });
    }

    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found,try again",
      });
    }
    const user_otp_code = user?.otp_code;
    const user_id = user?._id;
    if (parseInt(typed_otp_code) !== user_otp_code) {
      return res.status(200).send({
        status: 0,
        message: "OTP does not match",
      });
    } else {
      const user_verfied = await User.findByIdAndUpdate(
        user_id,
        { is_verified: true },
        { new: true }
      );
      const { email, is_verified, is_forgot_password } = user_verfied;
      if (is_forgot_password) {
        res.status(200).send({
          status: 1,
          message: "OTP successfully verified",
          email,
          is_verified,
          is_forgot_password,
        });
      } else {
        res.status(200).send({
          status: 1,
          message: "OTP successfully verified",
          email,
          is_verified,
        });
      }
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_password = user?.password;
    const user_id = user?._id;
    const matchPassword = await bcrypt.compare(typed_password, user_password);
    if (matchPassword) {
      const token = create_token(user_id);
      const user = await User.findByIdAndUpdate(
        user_id,
        { user_auth: token },
        { new: true }
      );
      return res.status(200).send({
        status: 0,
        message: "logged in succesfully",
        user,
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const forgot_password = async (req, res) => {
  try {
    const email_typed = req.body.email;
    if (!email_typed) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !email_typed.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    }
    const user = await User.findOne({ email: email_typed });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_id = user?._id;
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
    const user_updated = await User.findByIdAndUpdate(
      user_id,
      { is_verified: false, is_forgot_password: true, otp_code: gen_otp_code },
      { new: true }
    );
    const email = user_updated?.email;
    return res.status(200).send({
      status: 0,
      message: "forgot password successfully",
      email,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const reset_password = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await User.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_verfied = user?.is_verified;
    if (!user_verfied) {
      return res.status(400).send({
        status: 0,
        message: "user not verified",
      });
    }
    const user_id = user?._id;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(typed_password, salt);
    const user_updated = await User.findByIdAndUpdate(
      user_id,
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "reset password successful",
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const complete_profile = async (req, res) => {
  try {
    const user_id = req?.user?._id;
    const user_role = req?.user?.role;
    const job_request = req?.user?.job_request;
    const { name, phone, category, business_number, company_name, location } = req.body;
    if (!name) {
      return res.status(400).send({
        status: 0,
        message: "please enter your name",
      });
    } else if (!phone) {
      return res.status(400).send({
        status: 0,
        message: "please enter your phone number",
      });
    } else if (
      !phone.match(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter a valid phone number",
      });
    } else if (!category) {
      return res.status(400).send({
        status: 0,
        message: "please select a category",
      });
    } else if (!location) {
      return res.status(400).send({
        status: 0,
        message: "please enter your location",
      });
    } else if (user_role === "employer") {
      if (!business_number) {
        return res.status(400).send({
          status: 0,
          message: "please enter your business number",
        });
      } else if (
        !business_number.match(
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        )
      ) {
        return res.status(400).send({
          status: 0,
          message: "please enter a valid phone number",
        });
      } else if (!company_name) {
        return res.status(400).send({
          status: 0,
          message: "please enter your company name",
        });
      } else {
        const profile_image=req?.files?.profile_image
        const profile_image_path=profile_image ? profile_image[0]?.path?.replace(/\\/g,"/") : null
        const company_image=req?.files?.company_image
        const company_image_path=company_image ? company_image[0]?.path?.replace(/\\/g,"/") : null
        const employer = await User.findByIdAndUpdate(
          user_id,
          {
            name,
            phone_number: phone,
            profile_image:profile_image_path,
            industry_category: category,
            business_number,
            company_name,
            company_image:company_image_path,
            location,
            is_complete: true,
          },
          { new: true }
        );
        return res.status(200).send({
          status: 0,
          message: "employer profile completed successfully",
          employer,
        });
      }
    }else if (user_role === "employee") {
      const profile_image=req?.files?.profile_image
      const profile_image_path=profile_image ? profile_image[0]?.path?.replace(/\\/g,"/") : null
      if (job_request) {
        const employee = await User.findByIdAndUpdate(
          user_id,
          {
            name,
            phone,
            category,
            location,
            profile_image:profile_image_path,
            job_request: !job_request,
            is_complete: true,
          },
          { new: true }
        );
        return res.status(200).send({
          status: 0,
          message: "employee profile completed successfully",
          employee,
        });
      } else {
        const user = await User.findByIdAndUpdate(
          user_id,
          {
            name,
            phone,
            location,
            profile_image:profile_image_path,
            job_request: !job_request,
            category,
            is_complete: true,
          },
          { new: true }
        );
        return res.status(200).send({
          status: 0,
          message: "employee profile completed successfully",
          user,
        });
      }
    }
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const change_password = async (req, res) => {
  try {
    const user_id = req?.user?._id;
    const { password, new_password } = req.body;
    if (!password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    } else if (!new_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !new_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    const user_password = req?.user?.password;
    const matchPassword = await bcrypt.compare(password, user_password);
    if (matchPassword) {
      await User.findByIdAndUpdate(
        user_id,
        { password: hashedPassword },
        { new: true }
      );
      return res.status(200).send({
        status: 1,
        message: "password changed successfully",
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const delete_profile = async (req, res) => {
  try {
    const user_id = req?.user?._id;
    const password = req.body.password;
    if (!password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user_password = req?.user?.password;
    const matchPassword = await bcrypt.compare(password, user_password);
    if (matchPassword) {
      await User.findByIdAndUpdate(user_id, { is_delete: true }, { new: true });
      return res.status(200).send({
        status: 1,
        message: "user deleted successfully",
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  otp_verfy,
  login,
  forgot_password,
  reset_password,
  complete_profile,
  change_password,
  delete_profile,
};
