const express = require("express");
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceDetails,
  createServiceReview,
  getServiceReviews,
  deleteReview,
  getAdminServices,
  getApprovedServices
} = require("../controllers/serviceController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/services").get(getAllServices);

router.route("/getApprovedServices").get(getApprovedServices);


router
  .route("/admin/services")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminServices);

// router
//   .route("/admin/service/new")
//   .post(isAuthenticatedUser, authorizeRoles("admin"), createService);

router.route("/admin/service/new").post(createService);

router
  .route("/admin/service/:id")
  //.put(isAuthenticatedUser, authorizeRoles("admin"), updateService)
  .put(isAuthenticatedUser, updateService)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteService);

router.route("/service/:id").get(getServiceDetails);

router.route("/review").put(createServiceReview);

router
  .route("/reviews")
  .get(getServiceReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
