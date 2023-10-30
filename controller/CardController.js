const mongoose = require("mongoose");
const Card=require("../model/CardModel");

const add_card = async (req, res) => {
  try {
    const employer_id=req?.user?._id;
    const {name, card_number,expiry_date,cvv_number}=req?.body;
    if(!name){
      return res.status(500).send({
        status: 0,
        message: "please enter card holder name",
      });
    }else if(!card_number){
      return res.status(500).send({
        status: 0,
        message: "please enter card number",
      });
    }else if(!expiry_date){
      return res.status(500).send({
        status: 0,
        message: "please enter expiry date",
      });
    }else if(!cvv){
      return res.status(500).send({
        status: 0,
        message: "please enter cvv number",
      });
    }
    const card_exists=await Card.findOne({
      card_holder_name:name,
      card_number:card_number,
      expiry_date:expiry_date,
      cvv_number:cvv_number,
      employer_id:employer_id
    });
    if(card_exists){
      return res.status(500).send({
        status: 0,
        message: "card already registered",
        card:card_exists
      });
    }
    const employer_card=await Card.create({
      card_holder_name:name,
      card_number:card_number,
      expiry_date:expiry_date,
      cvv_number:cvv_number,
      employer_id:employer_id
    });
    return res.status(200).send({
      status:1,
      message:'user card added successfully',
      card:employer_card
    })
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const delete_card = async (req, res) => {
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

    await Card.findByIdAndDelete(card_id)

    return res.status(200).send({
      status:1,
      message:"card successfully deleted",
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports={
    add_card,
    delete_card,
}