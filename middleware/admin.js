const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (req.user.isAdmin) {
    next();
  }
  res.status(403).send({ success: false, message: "Access denied. " });
};
