"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: false,
      default: ""
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false, // Make mobile optional for social login
    },
    password: {
      type: String,
      required: false, // Make password optional for social login
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      type: Object,
    },
    profile_pic: {
      type: String,
    },
    identity_proof: {
      type: String,
    },
    meta_info: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

UserSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Middleware to hash the password before updating
UserSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this._update.password, 10);
    this._update.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", UserSchema);
