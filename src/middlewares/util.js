"use strict";
const { validationResult } = require("express-validator");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    `../../src/${process.env.GCP_CREDENTIALS}.json`
  ),
});

const bucketName = "acton_images";
const bucket = storage.bucket(bucketName);

const extractErrorMessages = (errors) => {
  let messages = [];
  errors.forEach(function (error) {
    messages.push(error.msg);
  });
  return messages;
};

const requestValiator = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let msg = extractErrorMessages(errors.errors);
    return res.status(400).json({ success: false, message: msg });
  }
  next();
};

const generateSignedUploadUrl = (file, type=null) => {
 return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file provided");
    }
    let imgFolder = type ? 'users' : "issues";
    const blob = bucket.file(`${imgFolder}/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error("GCS Upload Error:", err);
      reject(err);
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

const deleteImage = async(req, res) => {
  let imgFolder = req.body.type ? 'users' : "issues";
  const fileName = imgFolder + '/' + req.body.imgUrl.split("/").pop();
  try {
    if (!fileName) throw new Error("No file name provided");
    await bucket.file(fileName).delete();
    console.log(`Successfully deleted ${fileName}`);
    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(400).json({ success: false, message: error.message || "Error deleting image" });
  }
};

module.exports = {
  extractErrorMessages: extractErrorMessages,
  requestValiator: requestValiator,
  generateSignedUploadUrl: generateSignedUploadUrl,
  deleteImage: deleteImage
};
