const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  myOrdersProvider,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const {
  isAuthenticatedUser,
  isAuthenticatedProvider,
  authorizeRoles,
} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").post(isAuthenticatedUser, myOrders);

router.route("/orders/provider").post(isAuthenticatedProvider, myOrdersProvider);

router.route("/provider/orders").get(getAllOrders);

router
  .route("/provider/order/:id")
  //.put(isAuthenticatedProvider, authorizeRoles("provider"), updateOrder)
  //.delete(isAuthenticatedProvider, authorizeRoles("provider"), deleteOrder);
  .put(isAuthenticatedProvider, updateOrder)
  .delete(isAuthenticatedProvider, deleteOrder);

module.exports = router;
