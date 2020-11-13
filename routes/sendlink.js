const express = require("express");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const config = require("config");

const router = express.Router();

router.post("/email", (req, res) => {
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

      image.mv("./uploads/" + image.name);
      document.mv("./uploads/" + document.name);

      var transporter = nodemailer.createTransport(
        smtpTransport({
          // service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: "epaper@mtkenyatimes.co.ke",
            pass: "Email2020",
          },
          tls: {
            rejectUnauthorized: false,
          },
        })
      );

      var mailOptions = {
        from: "epaper@mtkenyatimes.co.ke",
        to: "paulbrian254@gmail.com",
        subject: "Sending Email using Node.js",
        text: "That was easy!",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      //send response
      // res.status(200).send({
      //   status: true,
      //   message: "File is uploaded",
      //   data: {
      //     image: image.name,
      //     imagemimetype: image.mimetype,
      //     imagesize: image.size,
      //     document: document.name,
      //     documentmimetype: document.mimetype,
      //     documentsize: document.size,
      //   },
      // });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
