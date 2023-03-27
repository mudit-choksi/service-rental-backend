const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter service Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter service Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter service Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter service Category"],
  },
  type: {
    type: String,
    required: [true, "Please Enter Rental or Service"],
  },
  isApproved:{
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
  adminapproved: {
    type: Boolean,
    default: false,
  },
  tags: [],
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("service", serviceSchema);
