"use strict";
const {
  saveCategory,
  getCategories,
  getCategorie,
  updateCategorie,
} = require("../models/category");

const createCategory = async (req, res) => {
  try {
    if (req.body.categoryName && req.body.categoryName.length > 3) {
      let category = await saveCategory({ name: req.body.categoryName });
      res
        .status(200)
        .json({
          success: true,
          message: "Category created successfully",
          data: category,
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    let category = await getCategorie(
      req.body.categoryId || req.body.categorieId
    );
    let catObj = {};
    if (category) {
      if (req.body.status) catObj["status"] = req.body.status;
      if (req.body.name) catObj["name"] = req.body.name;
      let updatedCat = await updateCategorie(category._id, catObj);
      res
        .status(200)
        .json({
          success: true,
          message: "category updated successfully",
          data: updatedCat,
        });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Unable to find category details" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    let catId = req.params.id;
    if (catId) {
      let category = await getCategorie(catId);
      res
        .status(200)
        .json({ success: true, message: "Category details", data: category });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Category id is required" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const categories = async (req, res) => {
  try {
    let category = await getCategories();
    res
      .status(200)
      .json({ success: true, message: "Category details", data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCategory: createCategory,
  getCategory: getCategory,
  categories: categories,
  updateCategory: updateCategory,
};
