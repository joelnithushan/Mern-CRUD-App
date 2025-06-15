const express=require("express");
const router=express.Router();

//insert mode;
const User=require("../Model/UserModel");

//insert user controller

const UserController=require("../Controller/UserController");

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUsers);
router.get("/:id",UserController.getById);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteUser);

//export
module.exports=router;