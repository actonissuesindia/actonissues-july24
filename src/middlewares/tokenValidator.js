const jwt = require("jsonwebtoken");

const issueToken = (data) => {
  try {
    let token = jwt.sign(data, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    throw err;
  }
};

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization.replace(/^Bearer\s+/, "");
    if (token) {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "This endpoint required valid Authorization token",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Provided Authorization token is expired / Invalid",
    });
  }
};

const sessionChecker = (req, res, next) => {
  if (req.session.token) {
    try {
      let decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.redirect("/admin");
    }
  } else {
    res.redirect("/admin");
  }
};

module.exports = {
  issueToken: issueToken,
  verifyToken: verifyToken,
  sessionChecker: sessionChecker,
};
