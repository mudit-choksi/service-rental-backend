const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getAllUserDetails,
  getSingleUser,
  updateUserRole,
  deleteUser,
  loginUserGoogle
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizeRoles,
  generateUsername,
  verifySocialUser
} = require("../middleware/auth");

const router = express.Router();

router.route("/generateUsername").post(generateUsername);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/loginuserGoogle").post(verifySocialUser, loginUserGoogle);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/userdetails").get(getAllUserDetails);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
