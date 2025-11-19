const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
  {
    titulo: {type: String,required: true},
    autor: {type: String,  required: true},
    genero: {type: String,required: true},
    administrador: { type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    prestamos: [
      {type: mongoose.Schema.Types.ObjectId,
        ref: 'prestamo',
      },
    ],
  },
  { timestamps: true,
    collection:'libro', },
);
const Libro = mongoose.model('libro', libroSchema, 'libro');
module.exports = Libro;
