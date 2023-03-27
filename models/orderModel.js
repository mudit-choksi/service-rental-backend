const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  deliveringOrderInfo: {
    address: {
      type: String,
      required: true,
    },
    // city: {
    //   type: String,
    //   required: true,
    // },

    // state: {
    //   type: String,
    //   required: true,
    // },

    // country: {
    //   type: String,
    //   required: true,
    // },
    // zipCode: {
    //   type: Number,
    //   required: true,
    // },
    phoneNo: {
      type: String,
      required: true,
    },
  },
  orderService: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: "Provider",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  servicePrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  additionalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Pending",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
