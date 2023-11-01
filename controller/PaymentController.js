const { default: mongoose } = require("mongoose");
const Payment=require("../model/PaymentModel");
const mongoose=require(mongoose);
const JobPost=require("../model/JobPostModel");

const pay_job_employee = async (req, res) => {
  try {
    const employer_id=req?.user?._id;
    const post_id=req?.body?.post_id;
    const card_id=req?.body?.card_id;
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
      }else if (!post_id) {
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
      const job_exists = await Card.findById(post_id);
      if (!job_exists) {
        return res.status(400).send({
          status: 0,
          message: "job post not found",
        });
      };
      const job_completed=job_exists?.job_completed;
      if(!job_completed){
        return res.status(400).send({
          status: 0,
          message: "job not yet completed",
        });
      }
      const Job_employer_id=job_exists?.employer_id;
      if(Job_employer_id.toString()!==employer_id.toString()){
        return res.status(400).send({
          status: 0,
          message: "Not authorized to pay for this job",
        });
      }
      const employee_id=job_exists?.employee_id;
      const charges_per_hours=job_exists?.charges_per_hours;
      const total_hours=job_exists?.total_hours;
      const paid_amount=charges_per_hours*total_hours;
      const payment_exists=await Payment.findOne({
        job_post_id:post_id,
        employee_id:employee_id,
        employer_id:employer_id,
      });
      if(payment_exists){
        return res.status(200).send({
          status:1,
          message:"payment already made",
          payment:payment_exists
        })
      }
      const employee_payment=await Payment.create({
        job_post_id:post_id,
        employee_id:employee_id,
        employer_id:employer_id,
        paid_amount:paid_amount,
        payment_date:moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
        is_paid:true,
      });
      await JobPost.findByIdAndUpdate(
        post_id,
        {status: "Paided",is_paid:true},
        {new:true}
      )
      return res.status(200).send({
        status:1,
        message:"payment successful",
        payment:employee_payment
      })
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
