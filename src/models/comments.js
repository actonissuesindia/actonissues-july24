"use strict";
const Comment = require("../schemas/comment");

const saveComment = async (comntObj) => {
  try {
    let comment = await new Comment(comntObj).save();
    return comment;
  } catch (err) {
    throw err;
  }
};

const getComments = async (comntId) => {
  try {
    let comments = await Comment.find({
      $or: [{ _id: comntId }, { userId: comntId }, { issueId: comntId }],
    })
      .populate("userId", "name profile_pic")
      .populate({
        path: "commentId",
        select: "comment userId",
        populate: {
          path: "userId",
          select: "name profile_pic",
        },
      });
    return comments;
  } catch (err) {
    throw err;
  }
};

const getcomments = async (issueIds) => {
  try {
    let comments = await Comment.find({ issueId: { $in: issueIds } })
      .populate("userId", "name profile_pic")
      .populate("commentId", "comment userId");
    return comments;
  } catch (err) {
    throw err;
  }
};

const getCommentsCount = async (comntId) => {
  try {
    let commentsCount = await Comment.count({
      $or: [{ userId: comntId }, { issueId: comntId }],
    });
    return commentsCount;
  } catch (err) {
    throw err;
  }
};

const deleteComment = async (comntId) => {
  try {
    let status = await Comment.findByIdAndRemove(comntId);
    return status;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  saveComment: saveComment,
  getComments: getComments,
  getcomments: getcomments,
  getCommentsCount: getCommentsCount,
  deleteComment: deleteComment,
};
