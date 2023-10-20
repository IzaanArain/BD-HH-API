const jwt=require("jsonwebtoken");

const create_token=(id)=>{
    return jwt.sign({id:id},process.env.TOKEN_KEY);
}


module.exports={
    create_token
}