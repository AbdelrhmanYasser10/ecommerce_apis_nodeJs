const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require("../config/jwtToken");
const validateMongoDBId = require("../utils/validateMongoDB");
const generateRefreshToken = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

const createUser = asyncHandler(
    async(req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({ email });

        if (!findUser) {
            //create new user
            const newUser = await User.create(req.body);
            res.json(newUser);
        } else {
            //User Already Exsist
            throw new Error('User Already Exsists');
        }
    }
);

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    //check if user exsists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(findUser?._id);  
      const updateUser = await User.findOneAndUpdate(findUser?._id,{refreshToken:refreshToken},{new:true});
      res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge:72*60*60*1000,
      });
      res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//get all users
const getallUsers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find();
        res.json({
            data: getUsers
        });
    } catch (err) {
        throw new Error(err);
    }
});

//get a single user
const getaUser = asyncHandler(
    async(req, res) => {
        const {
            id
        } = req.params;
        validateMongoDBId(id);
        try {
            const getaUser = await User.findById(id);
            res.json({
                data: getaUser,
            });
        } catch (err) {
            throw new Error(err);
        }
    }
);

const updateaUser = asyncHandler(
    async(req, res) => {
        const { id } = req.params;
        validateMongoDBId(id);
        try {
            const updateUser = await User.findByIdAndUpdate(id, {
                firstname: req?.body?.firstname,
                lastname:req?.body?.lastname,
                mobile:req?.body?.mobile,
                email:req?.body?.email,

            },{
              new:true,
            });
          res.json(updateUser);
        } catch (err) {
            throw new Error(err);
        }
    }
);

//delete a single user
const deleteaUser = asyncHandler(
    async(req, res) => {
        const {
            id
        } = req.params;
        validateMongoDBId(id);
        try {
            const deleteaUser = await User.findByIdAndDelete(id);
            res.json({
                message: "Deleted Successfully",
                data: deleteaUser
            });
        } catch (err) {
            throw new Error(err);
        }
    }
);

const blockUser = asyncHandler(
  async(req,res)=>{
    const { id } = req.params;
    
    try{
      const block = await User.findByIdAndUpdate(id,{
        isBlocked:true,
      },{
        new:true,
      });
      res.json({
        message:"User has been Blocked",
        data:block,
      });
    }catch(err){
      throw new Error(err);
    }
  }
);

const unBlockUser = asyncHandler(
  async(req,res)=>{
      const { id } = req.params;
    try{
      const unBlocked =await User.findByIdAndUpdate(id,{
        isBlocked:true,
      },{
        new:false,
      });
      res.json({
        message:"User has been Unblocked",
        data:unBlocked,
      });
    }catch(err){
      throw new Error(err);
    }
  }
);

const handleRefreshToken = asyncHandler(
  async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
      throw new Error('No refresh token in cookies');
    
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({
      refreshToken
    });
    if(!user){
      throw new Error('No refresh token present in database');
    }
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
      if(err || user.id !== decoded.id){
        throw new Error('There is something wrong with refres token');
      }
      const accessToken = generateToken(user?._id);
      res.json(accessToken);
    });
  }
);

const logout = asyncHandler(
  async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
      throw new Error('No refresh token in cookies');
    
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({
      refreshToken
    });
    if(!user){
      res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken,{
      refreshToken:"",
    });
    res.clearCookie('refreshToken',{
      httpOnly:true,
      secure:true,
    });
    return res.sendStatus(204); 
  }
);

module.exports = { createUser, loginUser, getallUsers, getaUser, deleteaUser , updateaUser,blockUser,unBlockUser,handleRefreshToken,logout};