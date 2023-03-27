const Category = require("../models/categoryModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

//  Get All Category
exports.getAllCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({
    success: true,
    category,
  });
});


exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHander("Category not found", 404));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Delete Successfully",
    category
  });
});