"use strict";
const Flag = require("../schemas/flag");
const Views = require("../schemas/views");

const saveFlag = async (flagObj) => {
  try {
    let flag = await new Flag(flagObj).save();
    return flag;
  } catch (err) {
    throw err;
  }
};

const addViewCount = async (viewObj) => {
  try {
    let view = await new Views(viewObj).save();
    return view;
  } catch (err) {
    throw err;
  }
};

const getFlag = async (filter) => {
  try {
    let flags = await Flag.findOne(filter);
    return flags;
  } catch (err) {
    throw err;
  }
};

const getView = async (filter) => {
  try {
    let view = await Views.findOne(filter);
    return view;
  } catch (err) {
    throw err;
  }
};

const getViewsCount = async (issueId) => {
  try {
    let viewsCount = await Views.count({ issueId: issueId });
    return viewsCount;
  } catch (err) {
    throw err;
  }
};

const getFlagsCount = async (flagId, status) => {
  try {
    let flagsCount = await Flag.count({ issueId: flagId, isLiked: status });
    return flagsCount;
  } catch (err) {
    throw err;
  }
};

const getFlags = async (issueIds, status) => {
  try {
    let flagsCount = await Flag.find({
      issueId: { $in: issueIds },
      isLiked: status,
    }).populate("userId", "name");
    return flagsCount;
  } catch (err) {
    throw err;
  }
};

const updateFlag = async (id, flagObj) => {
  try {
    let flag = await Flag.findByIdAndUpdate(id, flagObj, { new: true });
    return flag;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveFlag: saveFlag,
  getFlag: getFlag,
  getFlagsCount: getFlagsCount,
  getFlags: getFlags,
  updateFlag: updateFlag,
  addViewCount: addViewCount,
  getView: getView,
  getViewsCount: getViewsCount,
};
