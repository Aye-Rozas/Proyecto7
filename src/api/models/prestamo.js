const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema(
  {
    libro: {type: mongoose.Types.ObjectId, ref: 'libro', required: true},
    lector: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
    fechaInicio: {type: Date, default: Date.now},
    fechaFin: {type: Date, required: true},
    estado: {type: String, enum: ['activo', 'devuelto'], default: 'activo'},
  },
  { timestamps: true, collection:'prestamo' },
);

const Prestamo = mongoose.model('prestamo', prestamoSchema, 'prestamo');
module.exports = Prestamo;
