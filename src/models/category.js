"use strict";
const Category = require("../schemas/category");

const saveCategory = async (catObj) => {
  try {
    let category = await new Category(catObj).save();
    return category;
  } catch (err) {
    throw err;
  }
};

const getCategories = async (name = null) => {
  let qry = name ? { name: { $in: name } } : {};
  try {
    let categories = await Category.find(qry);
    return categories;
  } catch (err) {
    throw err;
  }
};

const getCategory = async (catId) => {
  try {
    let category = await Category.findById({ _id: catId });
    return category;
  } catch (err) {
    throw err;
  }
};

const updateCategory = async (catId, catObj) => {
  try {
    let category = await Category.findByIdAndUpdate(catId, catObj, {
      new: true,
    });
    return category;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveCategory: saveCategory,
  getCategories: getCategories,
  getCategorie: getCategory,
  updateCategorie: updateCategory,
};
