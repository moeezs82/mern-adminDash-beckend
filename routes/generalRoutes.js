const express = require("express");
const { getUser, loginUser, getUserDetails, logoutUser } = require("../controllers/generalController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();


router.route('/user/login').post(loginUser)
router.route("/user/me").get(isAuthenticatedUser, getUserDetails);
router.route("/user/logout").get(logoutUser);
router.route('/user/:id').get(getUser)

module.exports = router;