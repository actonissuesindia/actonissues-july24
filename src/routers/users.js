"use strict";
const express = require("express");
const {
  loginSchema,
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
} = require("../middlewares/userRequestValidator");
const {
  login,
  signup,
  verifyOTP,
  resendOTP,
  getuser,
  updateUser,
  addProfilePic,
  findUserByMobile,
  googleLogin,
  googleSignup,
} = require("../controllers/users");
const { verifyToken } = require("../middlewares/tokenValidator");
const { requestValiator } = require("../middlewares/util");
const router = express.Router();

router.use(express.json());

router.post("/signup", signupSchema, requestValiator, signup);
router.post("/login", loginSchema, requestValiator, login);
router.post("/verifyOTP", verifyOTPSchema, requestValiator, verifyOTP);
router.get("/getUser", verifyToken, getuser);
router.post("/findUser", findUserByMobile);
router.post("/updatePassword", updateUser);
router.post("/update", verifyToken, updateUser);
router.post("/googleSignup", googleSignup);
router.post("/googleLogin", googleLogin);

module.exports = router;
