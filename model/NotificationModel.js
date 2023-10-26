const mongoose=require("mongoose");
const {Schema}=mongoose;

const notificationSchema=new Schema({
    send_id:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        default:null
    },
    receiver_id:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        default:null
    },
    job_post_id:{
        type:mongoose.Types.ObjectId,
        ref:"jobPost",
        default:null
    },
    title:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    notification_date:{
        type:String,
        default:""
    },
    req_type:{
        type:Boolean,
        default:false
    }    
});

module.exports=mongoose.model("notification",notificationSchema)