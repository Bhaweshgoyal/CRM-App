const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { PORT } = require("./config/server.config");
const { mongoURI } = require("./config/db.config");
const authRoute = require("./routes/auth.route");
const { userRoute } = require("./routes/user.route");
const { ticketRoute } = require("./routes/ticket.route");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
userRoute(app);
authRoute(app);
ticketRoute(app);
app.listen(PORT, () => {
  console.log("Connection build successfully", PORT);
  mongoose.connect(mongoURI)
});
// const User = require("./models/user.model");
// const Ticket = require ("./models/ticket.model");
// mongoose.connect(mongoURI).then(
//   () => {
//     console.log("Connected Successfully ");
//   },
//   (err) => {
//     console.log("Error_Occured", err);
//   }
// );
