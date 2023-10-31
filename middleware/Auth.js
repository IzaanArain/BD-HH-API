const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const create_token = (id) => {
  return jwt.sign({ id: id }, process.env.TOKEN_KEY);
};

const user_validate_token = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).send({
        status: 0,
        message: "Unauthorized : Token is required",
      });
    }
    const token_user=await User.findOne({user_auth:token});
    if(!token_user){
      return res.status(400).send({
        status: 0,
        message: "not a valid token",
      });
    }
    const decoded = jwt.verify(token,process.env.TOKEN_KEY);
    const user_id = decoded?.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "Unauthorized : User not found",
      });
    } 
    const is_blocked=user?.is_blocked;
    if(is_blocked){
      return res.status(400).send({
        status: 0,
        message: "user account has been blocked, please contact admin",
      });
    };
    const is_delete=user?.is_delete;
    if(is_delete){
      return res.status(400).send({
        status: 0,
        message: "user account has been deleted, please contact admin",
      });
    };
      req.user = user;
      next();
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "failed to validate token",
    });
  }
};

module.exports = {
  create_token,
  user_validate_token,
};
