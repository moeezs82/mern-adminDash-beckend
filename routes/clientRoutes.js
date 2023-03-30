const express = require("express");
const { getProducts, getCustomers, getTransactions, getGeography } = require("../controllers/clientController");
const { authorizedRoles, isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route('/products').get(
    isAuthenticatedUser,
    authorizedRoles("admin", "superadmin"),
    getProducts
)
router.route('/customers').get(
    isAuthenticatedUser,
    authorizedRoles("admin", "superadmin"),
    getCustomers
)

router.route('/transactions').get(
    isAuthenticatedUser,
    authorizedRoles("admin", "superadmin"),
    getTransactions
)
router.route('/geography').get(
    isAuthenticatedUser,
    authorizedRoles("admin", "superadmin"),
    getGeography
)

module.exports = router;