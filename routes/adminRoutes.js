const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  deleteUserController,
} = require("../controllers/adminCtrl");
const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);

router.post("/deleteUser", deleteUserController);
module.exports = router;
