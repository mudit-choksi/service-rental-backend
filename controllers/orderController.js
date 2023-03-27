const Order = require("../models/orderModel");
const Product = require("../models/serviceModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { default: Stripe } = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//const object = require("mongodb");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    deliveringOrderInfo,
    orderService,
    paymentInfo,
    servicePrice,
    taxPrice,
    additionalPrice,
    totalPrice,
    provider,
  } = req.body;
  //   const providerId = object.ObjectId(providerid);
  //   console.log(providerId);

  const order = await Order.create({
    deliveringOrderInfo,
    orderService,
    paymentInfo,
    servicePrice,
    taxPrice,
    additionalPrice,
    totalPrice,
    paidAt: Date.now(),
    provider,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get logged in providers  Orders
exports.myOrdersProvider = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ provider: req.provider._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Provider
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Completed") {
    return next(new ErrorHander("You have already completed this order", 400));
  }

  if (req.body.status === "Approved") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Completed") {
    const charge = await stripe.charges.capture(
      req.body.chargeId
    );
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// delete Order -- Provider
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
