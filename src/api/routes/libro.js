const {isAuth , isAdmin } = require("../../middlewares/auth");
const { postLibro, getLibros, getLibroById, updateLibro, deleteLibro } = require("../controllers/libro");


const libroRoutes=require("express").Router();

libroRoutes.get("/:id",[isAuth],getLibroById);
libroRoutes.get("/",[isAuth],getLibros);
libroRoutes.post("/",[isAdmin],postLibro);
libroRoutes.put("/:id",[isAdmin], updateLibro);
libroRoutes.delete("/:id",[isAdmin],deleteLibro);

module.exports= libroRoutes;