const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error,
    });
  }
};

const deleteUserController = async (req, res) => {
  const { userId } = req.body;
  console.log("User id to delete is ", userId);
  try {
    const result = await userModel.deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
      res.status(200).send({
        success: true,
        message: "User data deleted",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};

module.exports = { getAllUsersController, deleteUserController };
