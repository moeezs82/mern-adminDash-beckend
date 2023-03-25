const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/jwtToken");



const loginUser = asyncHandler(async(req,res)=>{
  const { email, password } = req.body;

  //validating request
  if (!email || !password) {
    return res.status().json(
      {
        success: false,
        message: "Email and Password are required",
      },
      400
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "email or password incorrect",
    });
  }

  //this function(comparePassword) is defined in user model
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "email or password incorrect",
    });
  }

  sendToken(user, 200, res);
})

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});


//can access after login
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id);

  if (!user) {
    return res.status(200).json({
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});


//logout user function
const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };

  res.cookie("token", null, options);

  res.status(201).json({
    success: true,
    message: "Logged Out",
  });
});


module.exports = {
  getUser, loginUser, getUserDetails, logoutUser
};
