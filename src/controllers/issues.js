"use strict";
const {
  getIssues,
  saveIssue,
  getIssue,
  updateIssueDetails,
  gethotIssues,
  getMyIssue,
} = require("../models/issues");
const uniqid = require("uniqid");
const { getComments, getCommentsCount } = require("../models/comments");
const { getFlags, getFlagsCount, getViewsCount } = require("../models/likes");

const getissue = async (req, res) => {
  try {
    let isuId = req.params.issueId;
    if (isuId) {
      let issue = await getIssue(isuId);
      let supportCount = await getFlags(isuId, true);
      let unsupportCount = await getFlags(isuId, false);
      res
        .status(200)
        .json({
          sucess: true,
          message: "Issue details",
          data: { ...issue._doc, flags: supportCount, unflags: unsupportCount },
        });
    } else {
      res.status(400).json({ sucess: false, message: "Issue id is required" });
    }
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const getHotIssues = async (req, res) => {
  try {
    let hotIssues = await gethotIssues(
      { isHotIssue: true },
      { status: "approved" }
    );
    // let generalIssues= await getIssues({isHotIssue: true}, {status: "approved"})
    let swatchBharathIsues = await gethotIssues(
      { isSwatchBharat: true },
      { status: "approved" }
    );
    res
      .status(200)
      .json({
        sucess: true,
        message: "List of hot issues",
        data: { hotIssues, swatchBharathIsues },
      });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const issuesList = async (req, res) => {
  try {
    const location =
      req.query.lat && req.query.lng
        ? [req.query.lat * 1, req.query.lng * 1]
        : null; // Example coordinates for New York City
    const radius = 10000; // 1000 meters
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date("2023-01-01");
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();
    const status =
      req.query.status == "All"
        ? { $ne: "created" }
        : req.query.status == "Open"
        ? "approved"
        : req.query.status?.toLowerCase();
    const page = req.query.currentPage ? req.query.currentPage : 1;
    const limit = 10;
    const title = req.query.title ? req.query.title : null;
    let documents = await getIssues(
      location,
      radius,
      startDate,
      endDate,
      status,
      page,
      limit,
      title
    );
    res
      .status(200)
      .json({ sucess: true, message: "List of issues", data: documents[0] });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const createissue = async (req, res) => {
  try {
    let address = req.body.address;
    let images = req.body.images;
    let isuObj = {
      hashId: uniqid.process("#"),
      title: req.body.title,
      description: req.body.description,
      images: images,
      address: address,
      location: {
        type: "Point",
        coordinates: [address.lat_lng.lat, address.lat_lng.lng],
      },
      otherCategory: req.body.other,
      isSwatchBharat: req.body.isSwathyaBharat,
      userId: req.user.userId,
    };
    if (req.body.category) {
      isuObj["categoryId"] = req.body.category;
    }
    let issue = await saveIssue(isuObj);
    res
      .status(200)
      .json({
        sucess: true,
        message: "Issue created successfully",
        data: issue,
      });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const getUserIssues = async (req, res) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date("2023-01-01");
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();
    const status = { $ne: "created" };
    const page = req.query.currentPage ? req.query.currentPage : 1;
    const limit = 100;
    let documents = await getIssues(
      null,
      null,
      startDate,
      endDate,
      status,
      page,
      limit,
      null,
      req.params.userId
    );
    res
      .status(200)
      .json({ sucess: true, message: "user issues", data: documents[0] });
  } catch (err) {
    console.log(err);
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    let documents = await getMyIssue();
    res
      .status(200)
      .json({ sucess: true, message: "user issues", data: documents });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const updateIssue = async (req, res) => {
  try {
    let issue = await getIssue(req.body.issueId);
    let issueObj = {};
    if (issue) {
      if (req.body.status == "hot" || req.body.status == "unhot") {
        issueObj["isHotIssue"] = !issue.isHotIssue;
      } else {
        issueObj["status"] = req.body.status;
      }
    }
    let updatedIssue;
    if (issue && issueObj)
      updatedIssue = await updateIssueDetails(issue._id, issueObj);
    res
      .status(200)
      .json({
        sucess: true,
        message: "Issue status updated successfully",
        data: updatedIssue,
      });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

module.exports = {
  getissue: getissue,
  getMyIssues: getUserIssues,
  createissue: createissue,
  issuesList: issuesList,
  updateIssue: updateIssue,
  getHotIssues: getHotIssues,
  getAllIssues: getAllIssues,
};
