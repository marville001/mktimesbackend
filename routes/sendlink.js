const express = require("express");
const auth = require("../middleware/auth");
const { Mail } = require("../models/mails");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const router = express.Router();

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

      image.mv("./uploads/" + image.name);
      document.mv("./uploads/" + document.name);

      var transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: "themtkenyatimes@gmail.com",
            pass: "kahawasukari",
          },
          tls: {
            rejectUnauthorized: false,
          },
        })
      );

      let result = await Mail.find().select("-__v");
      const emails = result.map((res) => res.email).join(",");
      console.log("Results : ", result);
      console.log("Mails : ", emails);

      // var mailOptions = {
      //   from: "themtkenyatimes@gmail.com",
      //   to: "paulbrian254@gmail.com",
      //   subject: "Sending Email using Node.js",
      //   text: "That was easy! LOL!",
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //     res.status(500).send(error);
      //   } else {
      //     res.status(200).send("Email sent: " + info.response);
      //   }
      // });
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
