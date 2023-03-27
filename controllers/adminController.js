const Service = require("../models/serviceModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const object = require("mongodb");
const sendToken = require("../utils/jwtToken");
const Provider = require("../models/providerModel");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");




// Get not Approved provider
exports.createAdmin = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    const admin = await Admin.create({
        email,
        username,
        password
    });
    
    sendToken(admin, 201, res);
});


// Login Admin
exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    const admin = await Admin.findOne({
      $or: [{ email: email }, { username: email }],
    }).select("+password");
  
    if (!admin) {
      return next(new ErrorHander("Invalid email or password+", 401));
    }
  
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password-", 401));
    }
  
    sendToken(admin, 200, res);
});



// Delete Admin
exports.deleteAdmin = catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);
  
    if (!admin) {
      return next(
        new ErrorHander(`Admin does not exist with Id: ${req.params.id}`, 400)
      );
    }  
  
    await admin.remove();
  
    res.status(200).json({
      success: true,
      message: "Admin Deleted Successfully",
    });
});


// Get all admin accounts
exports.getAllAdmins = catchAsyncErrors(async (req, res, next) => {
    const admins = await Admin.find();
    
      res.status(200).json({
        success: true,
        admins,
      });
  });

// Get not Approved providers
exports.getAllAdminProviders = catchAsyncErrors(async (req, res, next) => {
  const providers = await Provider.find({isApproved:0});
  
    res.status(200).json({
      success: true,
      providers,
    });
});

  // Delete Provider --Admin
exports.adminDeleteProvider = catchAsyncErrors(async (req, res, next) => {
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



exports.adminDeleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(
        new ErrorHander(`Provider does not exist with Id: ${req.params.id}`, 400)
      );
    }
    
    //   await cloudinary.v2.uploader.destroy(imageId);
  
    await order.remove();
  
    res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
});


  // Delete Provider --Admin
exports.adminDeleteConsumer = catchAsyncErrors(async (req, res, next) => {
    const consumer = await User.findById(req.params.id);
  
    if (!consumer) {
      return next(
        new ErrorHander(`Consumer does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    const imageId = consumer.avatar.public_id;
  
    //   await cloudinary.v2.uploader.destroy(imageId);
  
    await consumer.remove();
  
    res.status(200).json({
      success: true,
      message: "Consumer Deleted Successfully",
    });
});


  // Accept or delete Service
exports.adminGetAllServicesApproval = catchAsyncErrors(async (req, res, next) => {
  // const services = await Service.find();
  const services = await Service.find({
    isApproved:0
  });
  res.status(200).json({
    success: true,
    services,
  });
});

// Delete unapproved Service

exports.adminDeleteService = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < service.images.length; i++) {
    await cloudinary.v2.uploader.destroy(service.images[i].public_id);
  }

  await service.remove();

  res.status(200).json({
    success: true,
    message: "Service Delete Successfully",
  });
});

// Update approval status for provider
exports.approveProvider = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    isApproved: 1,
  };
  const user = await Provider.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Provider Aprroved Successfully",
    user
  });
});

// Update approval status for service
exports.approveService = catchAsyncErrors(async (req, res, next) => {
  const newServiceData = {
    isApproved: 1,
  };
  const service = await Service.findByIdAndUpdate(req.params.id, newServiceData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Service Aprroved Successfully",
    service
  });
});


