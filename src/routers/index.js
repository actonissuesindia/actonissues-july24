const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "server is running" });
});

module.exports = router;
