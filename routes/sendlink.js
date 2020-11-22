const express = require("express");
const auth = require("../middleware/auth");
const { Mail } = require("../models/mails");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const router = express.Router();
const moment = require("moment");

router.post("/email", auth, async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let image = req.files.image;
      let link = req.files.link;
      let description = req.files.description;
      let document = req.files.document;
      let date = moment().format("YYYY-MM-DD");

      var rand = Math.floor(Math.random() * 10000 + 1);
      const imgname = rand + image.name;
      const docname = rand + document.name;

      image.mv("./uploads/" + imgname);
      document.mv("./uploads/" + docname);

      var transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "themtkenyatimes@gmail.com",
            pass: "kahawasukari",
          },
          tls: {
            rejectUnauthorized: false,
          },
        })
      );
      transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve(__dirname, "../views"),
            defaultLayout: false,
          },
          viewPath: path.resolve(__dirname, "../views"),
          extName: ".handlebars",
        })
      );
      let result = await Mail.find().select("-__v");
      const emails = result.map((res) => res.email).join(",");

      var mailOptions = {
        from: "themtkenyatimes@gmail.com",
        to: emails,
        subject: "Mt Kenya times Article and Magazine Update",
        template: "main",
        context: {
          image: "https://mktimes-backend.herokuapp.com/static/" + imgname,
          link,
          description,
          document: "https://mktimes-backend.herokuapp.com/static/" + docname,
          date,
        },
      };

      console.log(mailOptions.context);

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send({ success: false, error: error });
        } else {
          res.status(200).send({
            success: true,
            message: "Email sent ",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
