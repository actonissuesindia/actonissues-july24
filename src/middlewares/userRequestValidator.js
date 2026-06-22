"use strict";
const { body, oneOf, check } = require("express-validator");


const loginSchema = [
  oneOf(
    [
      body("loginId").matches(/^\d{10}$/),
      body("loginId").isEmail().normalizeEmail(),
    ],
    { message: "Valid email or phoneNumber is required" }
  ),
  check("password")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be graterthen 6 and lessthen 10"),
];

const signupSchema = [
  check("loginId")
    .matches(/^\d{10}$/)
    .withMessage("Valid phoneNumber is required"),
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    // allow letters, numbers and spaces
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Name must contain only letters, numbers and spaces")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be graterthen 3 and lessthen 200"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be graterthan 6"),
];

const verifyOTPSchema = [
  check("userId").isMongoId().withMessage("Please provide valid userId"),
  check("is_verified")
    .isBoolean()
    .withMessage("Verification status is required"),
];

const resendOTPSchema = [
  check("userId").isMongoId().withMessage("Please provide valid userId"),
];

module.exports = {
  loginSchema: loginSchema,
  signupSchema: signupSchema,
  verifyOTPSchema: verifyOTPSchema,
  resendOTPSchema: resendOTPSchema,
};
