const express = require("express");
const home = require("./routes/home");

const app = express();
require("./startup/logging")();
require("./startup/db")();

require("./startup/routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started at port " + PORT);
});
