const jwt=require("jsonwebtoken")

const checkUserRole=(requiredRole)=>async(req,res,next)=>{
    const user_role=req?.user?.role;
    if(user_role===requiredRole){
        next()
    }else{
        return res.status(403).json({ 
            status:0,
            message: 'Not authorized' 
        });
    }
}

module.exports={
    checkUserRole
};