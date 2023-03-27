const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Provider = require("../models/providerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a Provider
exports.registerProvider = catchAsyncErrors(async (req, res, next) => {
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //   folder: "avatars",
    //   width: 150,
    //   crop: "scale",
    // });

  //const { name, email, password } = req.body;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const phone = req.body.phone;
  const schoolyear = req.body.schoolyear;
  const address = req.body.address;
  const avatar = req.body.avatar;
  // const pincode = req.body.pincode;
  // const currlocation = req.body.currlocation;

  const provider = await Provider.create({
    fname,
    lname,
    email,
    username,
    password,
    avatar,
    phone,
    schoolyear,
    address,
    // pincode,
    // currlocation,
  });

  sendToken(provider, 201, res);
});

// Login Provider
exports.loginProvider = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const provider = await Provider.findOne({
    $or: [{ email: email }, { username: email }],
  }).select("+password");

  if (!provider) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await provider.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(provider, 200, res);
});


// Login Provider through google (temporary fix, does not actually verify with google token)
exports.loginProviderGoogle = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findOne({email: req.body.email});

  if (!provider) {
    return next(new ErrorHander("Account does not exist", 401));
  }

  sendToken(provider, 200, res);
});

// Logout Provider
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findOne({ email: req.body.email });

  if (!provider) {
    return next(new ErrorHander("Provider not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = provider.getResetPasswordToken();

  await provider.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: provider.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${provider.email} successfully`,
    });
  } catch (error) {
    provider.resetPasswordToken = undefined;
    provider.resetPasswordExpire = undefined;

    await provider.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const provider = await Provider.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!provider) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  provider.password = req.body.password;
  provider.resetPasswordToken = undefined;
  provider.resetPasswordExpire = undefined;

  await provider.save();

  sendToken(provider, 200, res);
});

// Get Provider Detail
exports.getProviderDetails = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);

  res.status(200).json({
    success: true,
    provider,
  });
});

// Get All Provider Detail
exports.getAllProviderDetails = catchAsyncErrors(async (req, res, next) => {
  const providers = await Provider.find();

  res.status(200).json({
    success: true,
    providers,
  });
});

// update Provider password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findById(req.provider.id).select("+password");

  const isPasswordMatched = await provider.comparePassword(
    req.body.oldPassword
  );

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  provider.password = req.body.newPassword;

  await provider.save();

  sendToken(provider, 200, res);
});

// update Provider Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newProviderData = req.body;

  // if (req.body.avatar !== "") {
  //   const provider = await Provider.findById(req.provider.id);

  //   const imageId = provider.avatar.public_id;

  //   // await cloudinary.v2.uploader.destroy(imageId);

  //   // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   //   folder: "avatars",
  //   //   width: 150,
  //   //   crop: "scale",
  //   // });

  //   // newUserData.avatar = {
  //   //   public_id: myCloud.public_id,
  //   //   url: myCloud.secure_url,
  //   // };
  // }

  const provider = await Provider.findByIdAndUpdate(
    req.provider.id,
    newProviderData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    provider
  });
});

// Get all providers(admin)
exports.getAllProvider = catchAsyncErrors(async (req, res, next) => {
  const providers = await Provider.find();

  res.status(200).json({
    success: true,
    providers,
  });
});

// Get single provider (admin)
exports.getSingleProvider = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorHander(`Provider does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    provider,
  });
});

// Delete Provider --Admin
exports.deleteProvider = catchAsyncErrors(async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorHander(`Provider does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = provider.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  await provider.remove();

  res.status(200).json({
    success: true,
    message: "Provider Deleted Successfully",
  });
});
