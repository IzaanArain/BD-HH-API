const pay_job_employee = async (req, res) => {
  try {
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports={
    pay_job_employee,
}
