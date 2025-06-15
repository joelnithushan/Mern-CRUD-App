const User = require("../Model/UserModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const addUsers = async (req, res) => {
  const { name, email, age, address } = req.body;
  try {
    const user = new User({ name, email, age, address });
    await user.save();
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ message: "Unable to add user", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, age, address } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, age, address }, { new: true });
    if (!user) return res.status(404).json({ message: "Unable to update user details" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: "Unable to update user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Unable to delete" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers, addUsers, getById, updateUser, deleteUser };
