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
          // host: "smtp.gmail.com",
          // port: 465,
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
        subject: "Sending Email using Node.js",
        template: "main",
        context: {
          image: "http://localhost:5000/static" + imgname,
          link,
          description,
          document: "http://localhost:5000/static" + docname,
          date,
        },
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send({ error: error });
        } else {
          res.status(200).send("Email sent: Check your email box for details");
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
