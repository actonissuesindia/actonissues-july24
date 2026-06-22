"use strict";
const mongoose = require("mongoose");

const FlagSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "issue",
    },
    isLiked: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("flag", FlagSchema);
