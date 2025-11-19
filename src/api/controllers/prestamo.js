const mongoose = require('mongoose');
const Libro = require('../models/libro');
const Prestamo = require('../models/prestamo');
const User = require('../models/user');

//? Create
const postPrestamo = async (req, res, next) => {
  try {
    const newPrestamo = new Prestamo(req.body);
    const prestamoSaved = await newPrestamo.save();
    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: prestamoSaved
    });
  } catch (error) {
    return res
      .status(400)
      .json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: `Error en la solicitud del préstamo: ${error.message}`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

//? get prestamos 

const getPrestamo = async (req, res, next) => {
  try {
    const prestamo = await Prestamo.find()
      .populate({ path: 'libro', select: 'titulo autor genero' })
      .populate({ path: 'lector', select: 'nombre email' });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: prestamo
    });
  } catch (error) {
    return res
      .status(404)
      .json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || "ServerError",
        message: `Error al obtener datos del préstamo: ${error.message}`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const getPrestamoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findById(id)
      .populate({ path: 'libro', select: 'titulo autor genero' })
      .populate({ path: 'lector', select: 'nombre email' });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: prestamo
    });
  } catch (error) {
    return res
      .status(404)
      .json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || "ServerError",
        message: `Error al obtener datos del préstamo: ${error.message}`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

//?Update

const updatePrestamo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Prestamo.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate({ path: 'libro', select: 'titulo autor genero' })
      .populate({ path: 'lector', select: 'nombre email' });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: updated
    });
  } catch (error) {
    return res
      .status(400)
      .json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: `Error al actualizar datos del préstamo: ${error.message}`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const deletePrestamo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Prestamo.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: deleted
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || "ServerError",
        message: `Error al eliminar préstamo: ${error.message}`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = {
  postPrestamo,
  getPrestamoById,
  getPrestamo,
  updatePrestamo,
  deletePrestamo,
};
