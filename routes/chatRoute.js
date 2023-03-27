const express = require("express");
const {
  getAllChatsUser,
  createChatUser,
  createChatProvider,
} = require("../controllers/chatController");
const router = express.Router();

router.route("/getchat").get(getAllChatsUser);

router.route("/chatuser/new").post(createChatUser);

router.route("/chatprovider/new").post(createChatProvider);

module.exports = router;
