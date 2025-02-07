require('dotenv').config()
const { User } = require("../Model/UserModel/UserModel")
const jwt=require("jsonwebtoken")
const checkuserdetails=async(req,resp,next)=>{
    const token=req.header("Authorization")
    if(!token) return resp.status(404).json({message:"Token is not found"})
    const payload=jwt.verify(token,process.env.JSON_SECRET_KEY)
    if(!payload || !payload.id) return resp.status(401).json({message:"Token is not valid"})
    const existinguser= await User.findOne({_id:payload.id}).select("-password")
    if(!existinguser) return resp.status(401).json({"message":"Unauthorised user"})
    req.user=existinguser
    next()
}
module.exports=checkuserdetails
