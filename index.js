const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/db");
const http = require("http");
//const socketio = require("socket.io");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: "dw1a14crt",
  api_key: "173557259112287",
  api_secret: "QM11khJchbtosEg_EuPG52T3WlY",
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
