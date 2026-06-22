const {
  saveFlag,
  getFlag,
  updateFlag,
  addViewCount,
  getView,
  getViewsCount,
  getFlagsCount,
} = require("../models/likes");

const saveFlagStatus = async (req, res) => {
  try {
    let flag = await getFlag({
      userId: req.body.userId,
      issueId: req.body.issueId,
    });
    if (flag) {
      await updateFlag(flag._id, { isLiked: req.body.status });
    } else {
      await saveFlag({
        userId: req.body.userId,
        issueId: req.body.issueId,
        isLiked: req.body.status,
      });
    }
    let supportCount = await getFlagsCount(req.body.issueId, true);
    let unsupportCount = await getFlagsCount(req.body.issueId, false);
    res
      .status(200)
      .json({
        success: true,
        message: "status saved successfully",
        supportCount: supportCount,
        unsupportCount: unsupportCount,
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const saveViewCount = async (req, res) => {
  try {
    let view = await getView({
      userId: req.body.userId,
      issueId: req.body.issueId,
    });
    if (view == null) {
      await addViewCount({
        userId: req.body.userId,
        issueId: req.body.issueId,
        isviewed: true,
      });
    }
    let viewCount = await getViewsCount(req.body.issueId);
    res
      .status(200)
      .json({
        success: true,
        message: "Viewcount saved successfully",
        data: viewCount,
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  saveFlagStatus: saveFlagStatus,
  saveViewCount: saveViewCount,
};
