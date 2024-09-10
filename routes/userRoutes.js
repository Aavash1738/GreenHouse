const express = require("express");
const {
  loginController,
  registerController,
} = require("../controllers/userCtrl");

const router = express.Router();

//login route
router.post("/login", loginController);

//register route
router.post("/register", registerController);

module.exports = router;
