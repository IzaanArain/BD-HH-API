const error_handler = async (err, req, res, next) => {
    try {
      //console.log("Error: ",err)
      // console.log(err instanceof multer.MulterError)
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        next();
      }
    } catch (err) {
      return res.status(403).json({
        status: 0,
        message: "Error Handler: Something went wrong",
      });
    }
  };

  module.exports={
    error_handler
  }