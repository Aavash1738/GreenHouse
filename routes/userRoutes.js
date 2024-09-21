const express = require("express");
const {
  loginController,
  registerController,
  authController,
  updateController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//login route
router.post("/login", loginController);

//register route
router.post("/register", registerController);

//Auth
router.post("/getUserData", authMiddleware, authController);

//Update plant
router.put("/updatePlant", updateController);

module.exports = router;
