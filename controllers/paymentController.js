const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const priceInPence = req.body.amount * 100;
  // const myPayment = await stripe.paymentIntents.create({
  //   amount: priceInPence,
  //   currency: "usd",
  //   metadata: {
  //     company: "studentserve",
  //   },
  // });
  const stripeToken = req.body.stripeToken;
  const myCharge = await stripe.charges.create({
    amount: priceInPence,
    currency: 'usd',
    source: stripeToken,
    capture: false,  // note that capture: false
 });

  res
    .status(200)
    //.json({ success: true, client_secret: myPayment.client_secret });
    .json({success: true, charge: myCharge});
});

exports.create = function(req, res, next) {
  
  stripe.charges.create({
     amount: priceInPence,
     currency: 'usd',
     source: stripeToken,
     capture: false,  // note that capture: false
  }).then(chargeObject => {
      makeOrderCreation(req, res, next, chargeObject)
  }).catch(error => {
      handleError(error);
  });
};

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
