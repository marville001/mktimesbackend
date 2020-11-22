const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const home = require("../routes/home");
const users = require("../routes/users");
const auth = require("../routes/auth");
const sendlink = require("../routes/sendlink");
const addCont = require("../routes/addCont");
const getCont = require("../routes/getCont");
const exphbs = require("express-handlebars");
const path = require("path");

module.exports = function (app) {
  app.use(fileUpload());
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(cors());
  app.use("/static", express.static(path.join(__dirname, "public")));

  app.engine("handlebars", exphbs());
  app.set("view engine", "handlebars");

  app.use("/", home);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/add", addCont);
  app.use("/api/get", getCont);
  app.use("/api/sendlink", sendlink);
};
