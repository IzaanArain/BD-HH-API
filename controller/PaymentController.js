const Payment=require("../model/PaymentModel");

const pay_job_employee = async (req, res) => {
  try {
    const card_id=req?.query?.card_id;
    if (!card_id) {
        return res.status(400).send({
          status: 0,
          message: "please enter card ID",
        });
      } else if (!mongoose.isValidObjectId(card_id)) {
        return res.status(400).send({
          status: 0,
          message: "Not a valid card ID",
        });
      }
      const card_exists = await Card.findById(card_id);
      if (!card_exists) {
        return res.status(400).send({
          status: 0,
          message: "card not found",
        });
      };
  
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
