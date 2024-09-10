const express = require("express");
const {
  loginController,
  registerController,
  authController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//login route
router.post("/login", loginController);

//register route
router.post("/register", registerController);

//Auth
router.post("/getUserData", authMiddleware, authController);

module.exports = router;
