const express = require("express");
const {
  registerProvider,
  loginProvider,
  logout,
  forgotPassword,
  resetPassword,
  getProviderDetails,
  updatePassword,
  updateProfile,
  getAllProvider,
  getSingleProvider,
  getAllProviderDetails,
  updateProviderRole,
  deleteProvider,
  loginProviderGoogle
} = require("../controllers/providerController");
const {
  isAuthenticatedProvider,
  authorizeRoles,
  verifySocialUser,
} = require("../middleware/auth");

const router = express.Router();

router.route("/registerprovider").post(registerProvider);

router.route("/loginprovider").post(loginProvider);

router.route("/loginproviderGoogle").post(verifySocialUser, loginProviderGoogle);

router.route("/password/forgotprovider").post(forgotPassword);

router.route("/password/resetprovider/:token").put(resetPassword);

router.route("/logoutprovider").get(logout);

// Unauthorized view providers (hides important provider info like password)
router.route("/providerdetails/:id").get(getProviderDetails);
router.route("/providerdetails").get(getAllProviderDetails);

router
  .route("/password/updateprovider")
  .put(isAuthenticatedProvider, updatePassword);

router.route("/me/updateprovider").put(isAuthenticatedProvider, updateProfile);

router
  .route("/admin/provider")
  .get(isAuthenticatedProvider, authorizeRoles("admin"), getAllProvider);

router
  .route("/admin/provider/:id")
  .get(isAuthenticatedProvider, authorizeRoles("admin"), getSingleProvider)
  .delete(isAuthenticatedProvider, authorizeRoles("admin"), deleteProvider);

module.exports = router;
