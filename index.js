require("dotenv").config();
const express= require("express");
const { connectDB } = require("./src/config/db");
const libroRoutes = require("./src/api/routes/libro");
const prestamoRoutes = require("./src/api/routes/prestamo");
const userRoutes = require("./src/api/routes/user");

const app=express();
connectDB();
app.use(express.json());

app.use("/api/v1/libro", libroRoutes);
app.use("/api/v1/prestamo", prestamoRoutes);
app.use("/api/v1/user", userRoutes);

app.use((req,res,next) => {
  return res.status(404).json("Route not found");
});

app.listen(3000,() => {
  console.log("servidor desplegado en http://localhost:3000");
  })