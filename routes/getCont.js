const express = require("express");
const router = express.Router();
const { Mail } = require("../models/mails");
const auth = require("../middleware/auth");

router.get("/mail", auth, async (req, res) => {
  let result = await Mail.find().select("-__v");
  res.send({ success: true, mails: result });
});

module.exports = router;
