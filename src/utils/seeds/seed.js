const mongoose = require("mongoose");
const dotenv = require('dotenv');
const Libro = require("../../api/models/libro");
const libros = require("../../data/data");

dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Conectado a MongoDB");
    const allLibros = await Libro.find();
    if (allLibros.length) {
      await Libro.collection.drop();
      console.log("Colección 'libros' limpiada");
    }
    await Libro.insertMany(libros);
    console.log(`${libros.length} libros insertados`);
  })
  .catch((err) => console.log(`Error al insertar: ${err}`))
  .finally(() => mongoose.disconnect());