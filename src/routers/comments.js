const express = require("express");
const {
  commentsList,
  createComment,
  commentsCount,
} = require("../controllers/comments");
const { verifyToken } = require("../middlewares/tokenValidator");
const router = express.Router();

router.use(express.json());

router.get("/:issueId", commentsList);
// router.get('/:commentId', commentsCount)
router.post("/", verifyToken, createComment);

module.exports = router;
