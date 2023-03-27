const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
// const http = require("http").Server(app);
// const io = require("socket.io")(http);

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use((_, res, next) => {
  // res.set("Access-Control-Allow-Origin", "*"); // or 'localhost:8888'
  res.set("Access-Control-Allow-Origin", "https://stuserve-web.herokuapp.com");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  return next();
}); // sets headers before routes

// Route Imports
const service = require("./routes/serviceRoute");
const user = require("./routes/userRoute");
const provider = require("./routes/providerRoute");
const category = require("./routes/categoryRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const admin = require("./routes/adminRoute");
const chat = require("./routes/chatRoute");

// io.on("connection", (socket) => {
//   console.log("user connected");
// });

app.use("/api/v1", service);
app.use("/api/v1", user);
app.use("/api/v1", provider);
app.use("/api/v1", category);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", admin);
app.use("/api/v1", chat);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
