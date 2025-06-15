const User = require("../Model/UserModel");
//data display
const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }

  //display all users
  return res.status(200).json({ users });
};

//data insert

const addUsers = async (req, res, next) => {
  const { name, email, age, address } = req.body;

  let users;
  try {
    users = new User({
      name,
      email,
      age,
      address,
    });
    await users.save();
  } catch (err) {
    console.log(err);
  }

  //not insert users
  if (!users) {
    return res.status(404).send({ message: "Unable to add user" });
  }
  return res.status(200).json({ users });
};

//get by id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let user;

  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }
  //not avilable users
  if (!user) {
    return res.status(404).send({ message: "Users not found" });
  }
  return res.status(200).json({ user });
};

//update user details
const updateUser=async (req, res, next) => {
    const id = req.params.id;
    const { name, email, age, address } = req.body;
    
    let user;
    try {
        user = await User.findByIdAndUpdate(id, {
            name,
            email,
            age,
            address
        });
    } catch (err) {
        console.log(err);
    }

    if (!user) {
    return res.status(404).send({ message: "Unable to update user details" });
  }
  return res.status(200).json({ user });
};

//delete User details
const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!user) {
    return res.status(404).send({ message: "Unable to delete" });
  }
  return res.status(200).json({ user });
}

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

