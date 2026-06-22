const Issue = require("../schemas/issue");
const user = require("../schemas/user");

const getIssues = async (
  location,
  radius,
  startDate,
  endDate,
  status,
  page,
  limit,
  title,
  userId = null
) => {
  let tqry = null;
  if (title) {
    let categories = await getCategories(title);
    let categoryId = categories.map((category) => category._id);
    tqry = { $or: [{ title: title }, { categoryId: { $in: categoryId } }] };
  }
  let pipeline = [];
  if (location) {
    let qry = {
      created_at: { $gte: startDate, $lte: endDate },
      status: status,
      isHotIssue: false,
    };
    if (tqry) qry = { ...qry, ...tqry };
    pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location,
          },
          distanceField: "location",
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $match: qry,
      },
      { $sort: { created_at: -1 } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "issueId",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $lookup: {
          from: "views",
          localField: "_id",
          foreignField: "issueId",
          as: "views",
        },
      },
      {
        $addFields: {
          viewsCount: { $size: "$views" },
        },
      },
      {
        $project: {
          comments: 0,
          views: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $unwind: {
          path: "$categories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "flags",
          localField: "_id",
          foreignField: "issueId",
          as: "flags",
        },
      },
      {
        $unwind: {
          path: "$flags",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          document: { $first: "$$ROOT" },
          flags: { $push: "$flags" },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$document", { flags: "$flags" }] },
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "totalIssues" },
            { $addFields: { page: page, limit: limit } },
          ],
          data: [
            { $sort: { created_at: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
        },
      },
    ];
  } else {
    let qry = {};
    if (userId) {
      qry = {
        $expr: {
          $eq: [
            {
              $toObjectId: userId,
            },
            "$userId",
          ],
        },
      };
    } else {
      qry = {
        created_at: { $gte: startDate, $lte: endDate },
        status: status,
        isHotIssue: false,
      };
      if (tqry) qry = { ...qry, ...tqry };
    }
    pipeline = [
      {
        $match: qry,
      },
      { $sort: { created_at: -1 } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "issueId",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $lookup: {
          from: "views",
          localField: "_id",
          foreignField: "issueId",
          as: "views",
        },
      },
      {
        $addFields: {
          viewsCount: { $size: "$views" },
        },
      },
      {
        $project: {
          comments: 0,
          views: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $unwind: {
          path: "$categories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "flags",
          localField: "_id",
          foreignField: "issueId",
          as: "flags",
        },
      },
      {
        $unwind: {
          path: "$flags",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          document: { $first: "$$ROOT" }, // Assuming you have other fields to retain
          flags: { $push: "$flags" },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$document", { flags: "$flags" }] },
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "totalIssues" },
            { $addFields: { page: page, limit: limit } },
          ],
          data: [
            { $sort: { created_at: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
        },
      },
    ];
  }
  try {
    const result = await Issue.aggregate(pipeline);
    return result;
  } catch (err) {
    throw err;
  }
};

const getHotIssues = async (issueFilter) => {
  try {
    let documents = await Issue.find(issueFilter)
      .sort({ created_at: -1 })
      .populate("categoryId")
      .populate("userId", "name");
    return documents;
  } catch (err) {
    throw err;
  }
};

const getMyIssues = async (userId) => {
  let query = {};
  if (userId) query = { userId };
  try {
    let documents = await Issue.find(query)
      .sort({ created_at: -1 })
      .populate("categoryId")
      .populate("userId", "name");
    return documents;
  } catch (err) {
    throw err;
  }
};

const getIssue = async (isuId) => {
  try {
    let issue = await Issue.findOne({
      $or: [{ _id: isuId }, { hashId: isuId }],
    })
      .sort({ created_at: -1 })
      .populate("categoryId")
      .populate("userId", "name");
    return issue;
  } catch (err) {
    throw err;
  }
};

const saveIssue = async (isuObj) => {
  try {
    let issue = await new Issue(isuObj).save();
    return issue;
  } catch (err) {
    throw err;
  }
};

const updateIssueDetails = async (id, issueObj) => {
  try {
    let issue = await Issue.findByIdAndUpdate(id, issueObj, { new: true });
    return issue;
  } catch (err) {
    throw err;
  }
};

const getDashboardData = async () => {
  try {
    createdIssuesCount = await Issue.count({ status: "created" });
    activeIssuesCount = await Issue.count({
      status: "approved",
      isHotIssue: false,
    });
    resolvedIssuesCount = await Issue.count({ status: "resolved" });
    usersCount = await user.count({ status: "active" });
    return {
      createdIssuesCount,
      activeIssuesCount,
      resolvedIssuesCount,
      usersCount,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getIssues: getIssues,
  saveIssue: saveIssue,
  getIssue: getIssue,
  updateIssueDetails: updateIssueDetails,
  gethotIssues: getHotIssues,
  getMyIssue: getMyIssues,
  getDashboardData: getDashboardData,
};
