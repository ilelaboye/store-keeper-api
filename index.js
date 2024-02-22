require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

const db = require("./src/core/config/db");
const bodyparser = require("body-parser");

db.sequelize.sync({ force: false, alter: true });
app.use(cors());

app.use(bodyparser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send(
    "this is index route for endpoints, welcome to your Store keeper project endpoints"
  );
});
require("./src/routes")(app);

app.listen(PORT);

console.log("App is running on port:" + PORT);
