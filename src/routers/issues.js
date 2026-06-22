const express = require('express');
const { verifyToken } = require('../middlewares/tokenValidator');
const { createissue, getissue, issuesList, getMyIssues, getHotIssues } = require('../controllers/issues');
const { generateSignedUploadUrl, deleteImage } = require('../middlewares/util');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get('/getIssue/:issueId', getissue)
router.get("/getMyIssues/:userId", verifyToken, getMyIssues)
router.get('/getIssues', issuesList)
router.post('/create', verifyToken, createissue)
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await generateSignedUploadUrl(req.file, req.body.type);
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading image" });
  }  
});
router.post('/deleteImage', verifyToken, deleteImage);
router.get("/getHotIssues", getHotIssues)

module.exports = router