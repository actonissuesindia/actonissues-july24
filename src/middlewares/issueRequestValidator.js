"use strict";
const { body, checkExact, check } = require("express-validator");

const createIssueSchema = [
  oneOf([
    body("categoryId").isMongoId().withMessage("Please provide valid category"),
    body("isSwathyaBharat")
      .isBoolean()
      .withMessage("Please provide valid category"),
  ]),
  body("title")
    .isString()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title length should be between 3 to 200"),
  body("description")
    .isString()
    .isLength({ min: 3, max: 2000 })
    .withMessage("Description length should be between 3 to 2000"),
  body("address").isObject().withMessage("Issue address is required"),
  body("images")
    .isArray()
    .isLength({ min: 3, max: 5 })
    .withMessage("At least 3 images are required"),
];

module.exports = {
  createIssueSchema: createIssueSchema,
};
