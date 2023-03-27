const Service = require("../models/serviceModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const object = require("mongodb");
//import { ObjectId } from 'mongodb'

// Create Service -- Admin
exports.createService = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "services",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  //req.body.user = req.user.id;

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    service,
  });
});

// Get All Service Of A Category
exports.getAllServices = catchAsyncErrors(async (req, res, next) => {
  //const resultPerPage = 8;
  const servicesCount = await Service.countDocuments();
  console.log(servicesCount);

  const apiFeature = new ApiFeatures(Service.find(), req.query)
    .search()
    .filter();

  let services = await apiFeature.query;

  let filteredServicesCount = services.length;

  //apiFeature.pagination(resultPerPage);

  services = await apiFeature.query;

  res.status(200).json({
    success: true,
    services,
    servicesCount,
    //resultPerPage,
    filteredServicesCount,
  });
});


// Get All Service Of A Category
exports.getApprovedServices = catchAsyncErrors(async (req, res, next) => {
  //const resultPerPage = 8;
  const servicesCount = await Service.countDocuments();
  console.log(servicesCount);

  const apiFeature = new ApiFeatures(Service.find({isApproved:1}), req.query)
    .search()
    .filter();

  let services = await apiFeature.query;

  let filteredServicesCount = services.length;

  //apiFeature.pagination(resultPerPage);

  services = await apiFeature.query;

  res.status(200).json({
    success: true,
    services,
    servicesCount,
    //resultPerPage,
    filteredServicesCount,
  });
});



// Get All Service
exports.getAdminServices = catchAsyncErrors(async (req, res, next) => {
  const services = await Service.find();

  res.status(200).json({
    success: true,
    services,
  });
});

//Get Service Details
exports.getServiceDetails = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  res.status(200).json({
    success: true,
    service,
  });
});

// Update Service -- Admin

exports.updateService = catchAsyncErrors(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < service.images.length; i++) {
      await cloudinary.v2.uploader.destroy(service.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "services",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    service,
  });
});

// Delete Service

exports.deleteService = catchAsyncErrors(async (req, res, next) => {
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

// Create New Review or Update the review
exports.createServiceReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, serviceId } = req.body;
  const review = {
    user: req.body._id,
    name: req.body.name,
    rating: Number(rating),
    comment,
  };
  // const userobject = new object.ObjectId(user)
  // const orderobject = new object.ObjectId(req.body.product)
  // const orderStatus = "completed";
  // const verified = await Orders.find(user, orderStatus);
  // if (!verified) {
  //   return next(new ErrorHander("Not eligible for review", 401));
  // }
  const service = await Service.findById(serviceId);
  console.log(service);

  // const isReviewed = service.reviews.find(
  //   (rev) => rev.user === req.body._id
  // );

  // if (isReviewed) {
  //   service.reviews.forEach((rev) => {
  //     if (rev.user === req.body._id)
  //       (rev.rating = rating), (rev.comment = comment);
  //   });
  // } else {
  //   service.reviews.push(review);
  //   service.numOfReviews = service.reviews.length;
  // }

  service.reviews.push(review);
  service.numOfReviews = service.reviews.length;

  let avg = 0;

  service.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  service.ratings = avg / service.reviews.length;

  await service.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a service
exports.getServiceReviews = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.query.id);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: service.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.query.serviceId);

  if (!service) {
    return next(new ErrorHander("Service not found", 404));
  }

  const reviews = service.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Service.findByIdAndUpdate(
    req.query.serviceId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
