const mongoose = require("mongoose");
const Joi = require("joi");

const mailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Mail = mongoose.model("Mail", mailSchema);

function validateMail(mail) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
  });
  return schema.validate(mail);
}

module.exports = {
  Mail,
  validate: validateMail,
};
