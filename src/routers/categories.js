const express = require("express");
const {
  getCategory,
  createCategory,
  categories,
} = require("../controllers/category");
const router = express.Router();

router.use(express.json());

router.get("/getCategory/:id", getCategory);
router.post("/createCategory", createCategory);
router.get("/getCategories", categories);

module.exports = router;
