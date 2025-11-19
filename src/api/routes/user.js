const { isAuth, isAdmin } = require("../../middlewares/auth");
const { getUser, register, login, deleteUser, updateUser, deleteSelf } = require("../controllers/user");


const userRoutes= require("express").Router();

userRoutes.get("/",[isAdmin], getUser);
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.put("/:id/rol",[isAdmin],updateUser);
userRoutes.delete("/delete",[isAuth],deleteSelf);
userRoutes.delete("/:id",[isAdmin],deleteUser);

module.exports= userRoutes;