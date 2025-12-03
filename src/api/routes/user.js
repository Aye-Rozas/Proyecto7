const { isAuth, isAdmin } = require("../../middlewares/auth");
const { getUser, register, login, deleteUser, updateUser } = require("../controllers/user");


const userRoutes= require("express").Router();

userRoutes.get("/",[isAdmin], getUser);
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.put("/:id",[isAuth],updateUser);
userRoutes.delete("/:id",[isAuth],deleteUser);

module.exports= userRoutes;