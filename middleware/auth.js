const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const { GoogleAuth } = require('google-auth-library');
const {OAuth2Client} = require('google-auth-library');
const sendToken = require("../utils/jwtToken");

const client = new OAuth2Client('155525793614-udf6ng70351hlvmtmfveafe83hpngl90.apps.googleusercontent.com');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  console.log(req.user);
  next();
});

exports.isAuthenticatedProvider = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.provider = await Provider.findById(decodedData.id);

  next();
});


exports.verifySocialUser = function(req, res, next) {
  // var GoogleAuth = require('google-auth-library');
  //var auth = new GoogleAuth();
  // check header or url parameters or post parameters for token
  //var token = "";
  // var tokenHeader = req.headers["authorization"];
  // var items = tokenHeader.split(/[ ]+/);
  // if (items.length > 1 && items[0].trim().toLowerCase() == "bearer") {
  //     token = items[1];
  //}
  var token = req.body.idToken;
  if (token) {
      var verifyToken = new Promise(function(resolve, reject) {
          client.verifyIdToken({
            idToken: token,
            audience: '155525793614-udf6ng70351hlvmtmfveafe83hpngl90.apps.googleusercontent.com', // If you have multiple [CLIENT_ID_1, CLIENT_ID_2, ...]
          },
              function(e, login) {
                  console.log(e);
                  if (login) {
                      // var payload = login.getPayload();
                      // var googleId = payload['sub'];
                      // resolve(googleId);
                      next();
                  } else {
                      reject("invalid token");
                  }
              }
          )
      }).catch(function(err) {
        return next(err);
      })
  } else {
      res.send("Please pass token");
  }
}

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }

    next();
  };
};

// Generate User
exports.generateUsername = catchAsyncErrors(async (req, res, next) => {
  try {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const getRandomNumber = (max) => Math.floor(Math.random() * max);
    endValue1 = getRandomNumber(firstName.length);
    endValue2 = getRandomNumber(lastName.length);
    if (endValue1 == 0) {
      endValue1 = 1;
    }
    if (endValue2 == 0) {
      endValue2 = 1;
    }
    var getUsername = firstName
      .slice(0, endValue1)
      .concat(lastName.slice(0, endValue2));

    getUsername = getUsername.concat(Math.floor(1000 + Math.random() * 9000));

    while (true) {
      var user = await User.findOne({ username: getUsername });
      if (!user) {
        break;
      }

      getUsername = getUsername
        .slice(0, -4)
        .concat(parseInt(getUsername.slice(-4)) + 1);
    }
    res.status(200).json({
      status: 200,
      message: "Generated Unique Username",
      data: getUsername,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
