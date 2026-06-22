"use strict";
const mongoose = require("mongoose");

const ViewsSchema = new mongoose.Schema(
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
    isviewed: {
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

module.exports = mongoose.model("views", ViewsSchema);
