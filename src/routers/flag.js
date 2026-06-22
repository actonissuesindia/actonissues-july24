const express = require("express");
const router = express.Router();
const { saveFlagStatus, saveViewCount } = require("../controllers/flag");
const { verifyToken } = require("../middlewares/tokenValidator");

router.use(express.json());

router.get("/:issueId", (req, res) => {
  res.json({ status: 200, message: "server is running" });
});
router.post("/", verifyToken, saveFlagStatus);
router.post("/viewCount", verifyToken, saveViewCount);

module.exports = router;
