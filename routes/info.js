const accountSid = "AC0cbda4a0aa0c067eaba9522a5b2edc0a";
const authToken = "95096bb00611ab4c0920853098c6ff51";
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body:
      "Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+254700207054",
  })
  .then((message) => console.log(message.sid))
  .done();
