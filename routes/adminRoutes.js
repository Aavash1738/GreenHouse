const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const getAllUsersController = require("../controllers/adminCtrl");
const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);

module.exports = router;
