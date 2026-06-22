"use strict";

const {
  saveComment,
  getComments,
  getCommentsCount,
} = require("../models/comments");

const createComment = async (req, res) => {
  try {
    let comntObj = {
      comment: req.body.comment,
      userId: req.user.userId,
      issueId: req.body.issueId,
    };
    if (req.body.replyTo) comntObj["commentId"] = req.body.replyTo;
    let comment = await saveComment(comntObj);
    res
      .status(200)
      .json({
        success: true,
        message: "Comment added successfully",
        data: comment,
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const commentsList = async (req, res) => {
  try {
    let cmtId = req.params.issueId;
    let comments = await getComments(cmtId);
    res
      .status(200)
      .json({ success: true, message: "List of comments", data: comments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const commentsCount = async (req, res) => {
  try {
    let cmtId = req.params.commentId;
    let commentsCount = await getCommentsCount(cmtId);
    res
      .status(200)
      .json({
        success: true,
        message: "List of comments",
        data: commentsCount,
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createComment: createComment,
  commentsList: commentsList,
  commentsCount: commentsCount,
};
