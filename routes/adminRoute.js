const express = require("express");
const {
    getAllAdminProviders,
    adminDeleteProvider,
    adminGetAllServicesApproval,
    adminDeleteService,
    approveProvider,
    approveService,
    createAdmin,
    getAllAdmins,
    loginAdmin,
    deleteAdmin,
    adminDeleteConsumer,
    adminDeleteOrder
} = require("../controllers/adminController");
const {
  isAuthenticatedProvider,
  authorizeRoles,
  verifySocialUser,
} = require("../middleware/auth");

const router = express.Router();

router.route("/deleteAdmin/:id").delete(deleteAdmin);

router.route("/loginAdmin").post(loginAdmin);

router.route("/getAllAdmins").get(verifySocialUser, getAllAdmins);

router.route("/createAdmin").post(createAdmin);

router.route("/getAllAdminProviders").get(getAllAdminProviders);

router.route("/adminDeleteProvider/:id").delete(adminDeleteProvider);
router.route("/adminDeleteConsumer/:id").delete(adminDeleteConsumer);
router.route("/adminDeleteOrder/:id").delete(adminDeleteOrder);


router.route("/adminGetAllServicesApproval").get(adminGetAllServicesApproval);
router.route("/adminDeleteService/:id").delete(adminDeleteService);


router.route("/approveProvider/:id").post(approveProvider);

router.route("/approveService/:id").post(approveService);


// // Unauthorized view providers (hides important provider info like password)
// router.route("/providerdetails/:id").get(getProviderDetails);
// router.route("/providerdetails").get(getAllProviderDetails);

// router
//   .route("/password/updateprovider")
//   .put(isAuthenticatedProvider, updatePassword);

// router.route("/me/updateprovider").put(isAuthenticatedProvider, updateProfile);

// router
//   .route("/admin/provider")
//   .get(isAuthenticatedProvider, authorizeRoles("admin"), getAllProvider);

// router
//   .route("/admin/provider/:id")
//   .get(isAuthenticatedProvider, authorizeRoles("admin"), getSingleProvider)
//   .delete(isAuthenticatedProvider, authorizeRoles("admin"), deleteProvider);

module.exports = router;