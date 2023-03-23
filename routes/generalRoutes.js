const express = require("express");
const { getUser } = require("../controllers/generalController");
const router = express.Router();

router.route('/user/:id').get(getUser)

module.exports = router;