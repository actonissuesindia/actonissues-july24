"use strict";
const User = require("../schemas/user");

const userLogin = async (identifier) => {
  try {
    let user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
    return user;
  } catch (err) {
    throw err;
  }
};

const getUser = async (userId) => {
  try {
    let user = await User.findOne({ _id: userId }).select("-password");
    return user;
  } catch (err) {
    throw err;
  }
};

const listOfUsers = async () => {
  try {
    let users = await User.find({ role: { $ne: "admin" } }).select("-password");
    return users;
  } catch (err) {
    throw err;
  }
};

const createUser = async (requestBody) => {
  try {
    let user = await new User(requestBody).save();
    return user;
  } catch (err) {
    throw err;
  }
};

const updateUserDetails = async (userObj, userId) => {
  try {
    let user = await User.findByIdAndUpdate(userId, userObj, { new: true });
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUser: getUser,
  createUser: createUser,
  userLogin: userLogin,
  updateUserDetails: updateUserDetails,
  listOfUsers: listOfUsers,
};
