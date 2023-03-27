//Approve and dis-apporve
const mongoose = require("mongoose");
const Provider = require("../models/providerModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");



const adminSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    username: {
      type: String,
      required: [true, "Please Generate Your Unique Username"],
      unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    recentpasswordchange: {
      type: Boolean,
      default: false,
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
adminSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};


// Compare Password
adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  

module.exports = mongoose.model("admin", adminSchema);
