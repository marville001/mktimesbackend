const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Mail, validate } = require("../models/mails");
const auth = require("../middleware/auth");

router.post("/mail", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  let emailCont = await Mail.findOne({ email: req.body.email });
  if (emailCont)
    return res
      .status(400)
      .send({ success: false, message: "Email already added..." });

  emailCont = new Mail(_.pick(req.body, ["name", "email"]));
  await emailCont.save();

  res.send({
    success: true,
    emailCont: _.pick(emailCont, ["_id", "name", "email", "isSubscribed"]),
  });
});

module.exports = router;
