"use strict";
const express = require("express");
const app = new express();
require('dotenv').config({ path: __dirname + '/.env' });
const port = process.env.PORT || 8000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const indexRouter = require("./routers/index");
require("./db");
const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const flagRouter = require("./routers/flag");
const commentRouter = require("./routers/comments");
const issueRouter = require("./routers/issues");
const newsRouter = require("./routers/news");
const adminRouter = require("./routers/admin");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const User = require("./schemas/user");
const jwt = require("jsonwebtoken");
const path = require("path");

//Express methods
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// cors
app.use(cors());
app.use(cookieParser());

app.use(
  session({
    name: "ActOnIssue",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV==="production", // This will only work if you have https enabled!
      maxAge: 60000 * 120, // 2 hours
    },
  })
);
app.use(function (req, res, next) {
  if (req.session.token) {
    let userObj = jwt.decode(req.session.token);
    res.locals.user = JSON.stringify(userObj);
  }
  next();
});
// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static("assets"));
// app.use(express.static(__dirname + '/uploads'))

// api documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/issue", issueRouter);
app.use("/api/comment", commentRouter);
app.use("/api/flag", flagRouter);
app.use("/api/views", flagRouter);
app.use("/api/trandingNews", newsRouter);

app.use("/admin", adminRouter);

app.listen(port, async () => {
  // await new User({name: "admin", mobile: "98765", email: "admin@actonissues.com", password: "Admin@123", role: "admin", is_verified: true}).save()
  console.log(`server is running on :: ${port}`);
});

//catch 404 errors and forwarded to error handler
app.use((req, res, next) => {
  res.status(404).send("Bad request/Invalid url");
});

// Default error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.stack);
});

module.exports = app;
