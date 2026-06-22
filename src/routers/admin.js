const express = require("express");
const router = express.Router();
const {
  loginSchema,
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
} = require("../middlewares/userRequestValidator");
const {
  login,
  signup,
  getuser,
  updateUser,
  getusers,
} = require("../controllers/users");
const { sessionChecker } = require("../middlewares/tokenValidator");
const {
  issuesList,
  updateIssue,
  getAllIssues,
} = require("../controllers/issues");
const { getIssue, getDashboardData } = require("../models/issues");
const {
  getComments,
  deleteComment,
  saveComment,
} = require("../models/comments");
const {
  getCategory,
  createCategory,
  categories,
  updateCategory,
} = require("../controllers/category");

router.get("/", (req, res) => {
  if (req.session.token) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("login");
  }
});

router.post("/login", loginSchema, login);
router.get("/dashboard", sessionChecker, async (req, res) => {
  let response = await getDashboardData();
  res.render("dashboard", { response });
});
router.get("/users", sessionChecker, (req, res) => {
  res.render("users");
});
router.get("/getUsers", sessionChecker, getusers);
router.post("/updateUserStatus", sessionChecker, updateUser);
router.get("/issues", sessionChecker, (req, res) => {
  res.render("issues");
});
router.get("/issueDetails/:id", sessionChecker, async (req, res) => {
  let issue = await getIssue(req.params.id);
  let comments = await getComments(req.params.id);
  res.render("issueDetails", { issue, comments });
});
router.post("/deleteComment", sessionChecker, async (req, res) => {
  let sts = await deleteComment(req.body.commentId);
  res
    .status(200)
    .json({ status: 200, message: "comment deleted successfully", data: sts });
});
router.post("/replyComment", sessionChecker, async (req, res) => {
  let comntObj = {
    comment: req.body.reply,
    userId: req.user.userId,
    issueId: req.body.issuId,
  };
  if (req.body.replyId) comntObj["commentId"] = req.body.replyId;
  let sts = await saveComment(comntObj);
  res
    .status(200)
    .json({ status: 200, message: "comment deleted successfully", data: sts });
});
router.post("/createComment", sessionChecker, async (req, res) => {
  let comntObj = {
    comment: req.body.comment,
    userId: req.user.userId,
    issueId: req.body.issId,
  };
  let sts = await saveComment(comntObj);
  res
    .status(200)
    .json({ status: 200, message: "comment deleted successfully", data: sts });
});
router.post("/updateIssueStatus", sessionChecker, updateIssue);
router.get("/getIssues", sessionChecker, getAllIssues);
router.get("/categories", sessionChecker, (req, res) => {
  res.render("categories");
});
router.post("/updateCategory", sessionChecker, updateCategory);
router.get("/getCategories", sessionChecker, categories);
router.post("/createCategory", sessionChecker, createCategory);
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ status: "success" });
});

module.exports = router;
