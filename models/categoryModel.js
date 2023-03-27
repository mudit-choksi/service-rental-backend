const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Category Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter service Description"],
  },
});

module.exports = mongoose.model("category", categorySchema);
