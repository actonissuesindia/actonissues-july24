"use strict";
const express = require("express");
const { getNews } = require("../controllers/news");
const router = express.Router();

router.use(express.json());

router.get("/get", getNews);

module.exports = router;
