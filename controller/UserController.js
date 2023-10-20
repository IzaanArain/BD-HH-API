const { create_token } = require("../middleware/Auth");
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
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
    });
    return res.status(200).send({
      status: 1,
      message: "signUp successful",
      user:user
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
    const {email:typed_email,otp_code:typed_otp_code}=req.body;
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
      const user_id=user?._id
      if (parseInt(typed_otp_code) !== user_otp_code) {
        return res.status(200).send({
          status: 0,
          message: "OTP does not match",
        });
      }else{
        const user_verfied=await User.findByIdAndUpdate(
          user_id,
          {is_verified:true},
          {new:true});
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

const login=async(req,res)=>{
  try{
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
    const user_password=user?.password;
    const user_id=user?._id;
    const matchPassword=await bcrypt.compare(typed_password,user_password)
    if(matchPassword){
      const token=create_token(user_id);
      const user=await User.findByIdAndUpdate(
        user_id,
        {user_auth:token},
        {new:true});
        return res.status(200).send({
          status: 0,
          message:"logged in succesfully",
          user
        })
    }else{
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  }catch(err){
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
}

const complete_profile=async(req,res)=>{
  try{
    const name=req.body.name;
    
  }catch(err){
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
}
module.exports = {
  signup,
  otp_verfy,
  login
};
