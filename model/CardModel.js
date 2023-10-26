const mongoose=require("mongoose");
const {Schema}=mongoose;

const cardSchema=new Schema({
    card_holder_name:{
        type:String,
        default:""
    },
    card_number:{
        type:Number,
        default:null
    },
    expiry_date:{
        type:String,
        default:""
    },
    cvv_number:{
        type:Number,
        default:null
    },
    employer_id:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        default:null
    }
})

module.exports=mongoose.model("card",cardSchema);