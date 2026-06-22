"use strict";
const {
  getUser,
  createUser,
  userLogin,
  updateUserDetails,
  listOfUsers,
} = require("../models/users");
const { issueToken } = require("../middlewares/tokenValidator");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
  try {
    let user = await userLogin(req.body.loginId);
    if (user && user.is_verified) {
      res.status(400).json({
        success: false,
        message: "User already existed with this mobile number",
      });
    } else {
      let userObj;
      if (!user) {
        userObj = {
          name: req.body.name,
          mobile: req.body.loginId,
          email: req.body.email,
          password: req.body.password,
        };
        user = await createUser(userObj);
      }
      res.status(200).json({
        success: true,
        message: `User created`,
        data: { userId: user._id },
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const findUserByMobile = async (req, res) => {
  try {
    let user = await userLogin(req.body.loginId);
    if (user) {
      res.status(200).json({
        success: true,
        message: `User existed with the given number`,
        data: { userId: user._id },
      });
    } else {
      res.status(400).json({ success: false, message: `User not found` });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    let user = await userLogin(req.body.loginId);
    if (user && user.is_verified) {
      if (user.status == "active") {
        let isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
          let token = issueToken({
            userId: user._id,
            role: user.role,
            name: user.name,
          });
          if (user.role == "admin") {
            req.session.token = token;
            req.session.save();
          }
          res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: token,
          });
        } else {

          res.status(400).json({
            success: false,
            message: "User Name or Password is wrong",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Something went wrong. Please contact to admin",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Please signup or verify your details",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { userId, is_verified } = req.body;
    let user = await getUser(userId);
    if (user) {
      await updateUserDetails({ is_verified }, user._id);
      let token = issueToken({
        userId: user._id,
        role: user.role,
        name: user.name,
      });
      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Sorry!, We are unable to find your details.",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getuser = async (req, res) => {
  try {
    if (req.user.userId) {
      let user = await getUser(req.user.userId);
      if (user) {
        res
          .status(200)
          .json({ success: true, message: "user details", data: user });
      } else {
        res.status(400).json({
          success: false,
          message: "We are unable to find your details",
        });
      }
    } else {
      res.status(400).json({ success: false, message: "UserId required" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getusers = async (req, res) => {
  try {
    let users = await listOfUsers();
    res
      .status(200)
      .json({ success: true, message: "user details", data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await getUser(req.body.userId || req.user.userId);
    let userObj = {};
    if (user) {
      if (req.body.status) {
        userObj["status"] = req.body.status;
      }
      if (req.body.full_name) {
        userObj["full_name"] = req.body.full_name;
      }
      if (req.body.name) {
        userObj["name"] = req.body.name;
      }
      if (req.body.profile_pic) {
        userObj["profile_pic"] = req.body.profile_pic;
      }
      if (req.body.gender) {
        userObj["gender"] = req.body.gender;
      }
      if (req.body.address) {
        userObj["address"] = req.body.address;
      }
      if (req.body.identity_proof) {
        userObj["identity_proof"] = req.body.identity_proof;
      }
      if (req.body.password) {
        userObj["password"] = req.body.password;
      }
      let updatedUser = await updateUserDetails(userObj, user._id);
      res.status(200).json({
        success: true,
        message: "profile details updated successfully",
        data: updatedUser,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Unable to find user details" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const googleSignup = async (req, res) => {
  try {
    let user = await userLogin(req.body.email);
    if (user && user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let userObj;
    if (!user) {
      userObj = {
        name: req.body.name,
        email: req.body.email,
        googleId: req.body.uid, // Use uid from frontend as googleId
        provider: "google",
        is_verified: true, // Google users are automatically verified
      };
      user = await createUser(userObj);
    }

    let token = issueToken({
      userId: user._id,
      role: user.role,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      message: "User created and logged in successfully",
      data: token,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    let user = await userLogin(req.body.email);
    if (user && user.provider === "google" && user.is_verified) {
      if (user.status === "active") {
        let token = issueToken({
          userId: user._id,
          role: user.role,
          name: user.name,
        });
        if (user.role === "admin") {
          req.session.token = token;
          req.session.save();
        }
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          data: token,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Something went wrong. Please contact to admin",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Please signup with Google first",
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  login: login,
  signup: signup,
  verifyOTP: verifyOTP,
  getuser: getuser,
  updateUser: updateUser,
  getusers: getusers,
  findUserByMobile: findUserByMobile,
  googleSignup: googleSignup,
  googleLogin: googleLogin,
};
