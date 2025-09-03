const User = require("../models/user.schema");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Create user
const createUser = async (req, res, next) => {
  try {
    console.log("calling createUser",req.body);
    
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Username and email required" });
    }
    username = name.toLowerCase();
    const user = new User({ username, email });
    await user.save();
    console.log("user created",user);
    
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, createUser };
