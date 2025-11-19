const { isAuth, isAdmin } = require("../../middlewares/auth");
const { getPrestamoById, getPrestamo, postPrestamo, updatePrestamo, deletePrestamo } = require("../controllers/prestamo");


const prestamoRoutes= require("express").Router();

prestamoRoutes.get("/:id",[isAdmin], getPrestamoById);
prestamoRoutes.get("/",[isAdmin], getPrestamo);
prestamoRoutes.post("/",[isAdmin],postPrestamo);
prestamoRoutes.put("/:id",[isAdmin],updatePrestamo);
prestamoRoutes.delete("/:id",[isAdmin],deletePrestamo);

module.exports= prestamoRoutes;
