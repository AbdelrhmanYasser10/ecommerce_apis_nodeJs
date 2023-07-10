const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleWare = asyncHandler(
  async(req,res,nxt)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
          if(token){
              const decoded = jwt.verify(token,process.env.JWT_SECRET);
              const user = await User.findById(decoded.id);
              req.user = user;
              nxt();
          }
        }catch(err){
          throw new Error('Not Authorized Token Expired');
        }
    }else{
      throw new Error('There is no token');
    }
  }
);

const isAdmin = asyncHandler(
  async (req,res,nxt)=>{
   const {email} = req.user;
   const adminuser = await User.findOne({email});
   if(adminuser.isAdmin !== 'admin' ){
      throw new Error('You are not an admin');
   }
   else{
    nxt();
   }
  }
);

module.exports = {authMiddleWare,isAdmin};