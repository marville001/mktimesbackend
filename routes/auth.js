const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  let user = await User.findOne({ username: req.body.username });

  if (!user)
    return res
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  res.send({
    success: true,
    user: _.pick(user, [
      "_id",
      "name",
      "username",
      "isAdmin",
      "hassFullAccess",
    ]),
    token: user.generateAuthToken(),
  });
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = router;
