const mongoose=require("mongoose");
const {Schema}=mongoose;

const appliedJobPostSchema=new Schema({
    job_post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobPost",
        default:null
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        default:null
    },
    is_applied:{
        type:Boolean,
        default:false
    },
    applied_date:{
        type:String,
        default:""
    }
},
{
    timestamps:true
});

module.exports=mongoose.model("appliedJobPost",appliedJobPostSchema)