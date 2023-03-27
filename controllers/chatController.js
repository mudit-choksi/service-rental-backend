const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const object = require("mongodb");

exports.getAllChatsUser = catchAsyncErrors(async (req, res, next) => {
  const chat = await User.find(
    {
      user: req.body.user,
    },
    { recivedChat: { provider: req.body.provider } },
    { sentChat: { provider: req.body.provider } }
  );

  res.status(200).json({
    success: true,
    chat,
  });
});

exports.createChatUser = catchAsyncErrors(async (req, res, next) => {
  const msgu = {
    provider: req.body.provider,
    message: req.body.message,
  };

  const msgp = {
    user: req.body.user,
    message: req.body.message,
  };

  const user = await User.findById(req.body.user);
  user.sentChat.push(msgu);

  const provider = await Provider.findById(req.body.provider);
  provider.receivedChat.push(msgp);

  await user.save({ validateBeforeSave: false });
  await provider.save({ validateBeforeSave: false });
  console.log(provider);
  res.status(201).json({
    success: true,
    user,
  });
});


exports.createChatProvider = catchAsyncErrors(async (req, res, next) => {
  const msgu = {
    user: req.body.user,
    message: req.body.message,
  };

  const msgp = {
    provider: req.body.provider,
    message: req.body.message,
  };

  const provider = await Provider.findById(req.body.provider);
  provider.sentChat.push(msgu);

  const user = await User.findById(req.body.user);
  user.receivedChat.push(msgp);

  await user.save({ validateBeforeSave: false });
  await provider.save({ validateBeforeSave: false });
  console.log(provider);
  res.status(201).json({
    success: true,
    provider,
  });
});

// exports.createChatProvider = catchAsyncErrors(async (req, res, next) => {
//   const saveUserChat = await User.updateOne(
//     { user: req.body.user },
//     { $push: { recivedChat: req.body.sentChat } }
//   );

//   const saveProviderChat = await Provider.updateOne(
//     { provider: req.body.provider },
//     { $push: { sentChat: req.body.sentChat } }
//   );
//   console.log(saveUserChat);
//   res.status(201).json({
//     success: true,
//     saveProviderChat,
//   });
// });
