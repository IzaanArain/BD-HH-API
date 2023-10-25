const requstDetails = async (req, res, next) => {
  try {
    console.log(`${req.method} ${req.hostname}${req.originalUrl}`.magenta.italic);
    next();
  } catch (err) {
    console.error("Error :", err.message);
    return res.status(403).json({
      status: 0,
      message: "Request details : Something went wrong",
      Error: err.message,
    });
  }
};

module.exports = {   
  requstDetails,
};
