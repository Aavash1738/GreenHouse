const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//login handler
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in login control" });
  }
};

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: `User already exists`, success: false });
    }
    const existingUsername = await userModel.findOne({ name: req.body.name });
    if (existingUsername) {
      return res.status(200).send({
        message: `Username already taken, please choose another.`,
        success: false,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: `Registered Successfully`, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller error ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userID });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const updateController = async (req, res) => {
  try {
    const { plant, userId } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { plant: plant },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).send({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  updateController,
};
