const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewRateSchema=new Schema({
    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default:null
      },
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default:null
      },
      rate:{
        type:Number,
        enum:[0,1,2,3,4,5],
        default:0
      },
      review_body:{
        type:String,
        default:""
      },
      review_date:{
        type:String,
        default:""
      }
})

module.exports=mongoose.model("reviewRate",reviewRateSchema)