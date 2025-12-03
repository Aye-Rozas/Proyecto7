const Libro = require('../models/libro');

//!Create
const postLibro = async (req, res, next) => {
  try {
    const newLibro = new Libro(req.body);
    const libroSaved = await newLibro.save();
    const libroPopulado = await Libro.findById(libroSaved._id)
      .populate({ path: 'administrador', select: 'nombre email rol' })
      .populate({
        path: 'prestamos',
        select: 'fechaInicio fechaFin estado',
        populate: { path: 'lector', select: 'nombre email' },
      });
    return res
      .status(201)
      .json({ success: true, statusCode: 201, data: libroPopulado });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message:" Error al crear libro",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

//! Get

const getLibros = async (req, res, next) => {
  try {
    const libros = await Libro.find()
      .populate({ path: 'administrador', select: 'nombre email rol' })
      .populate({
        path: 'prestamos',
        select: 'fechaInicio fechaFin estado',
        populate: { path: 'lector', select: 'nombre email' },
      });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: libros,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || 'ServerError',
        message: "Error al obtener libros",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

//! get by id
const getLibroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id)
      .populate({ path: 'administrador', select: 'nombre email rol' })
      .populate({
        path: 'prestamos',
        select: 'fechaInicio fechaFin estado',
        populate: { path: 'lector', select: 'nombre email' },
      });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: libro,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || 'ServerError',
        message: "Error al obtener libro",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

//!Update 

const updateLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldLibro = await Libro.findByIdAndUpdate(id);
    if (!oldLibro) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { type: 'NotFound', message: "Libro no encontrado" },
      });
    }
    const operacionesMongo = {};
    const { agregarPrestamos, eliminarPrestamos, ...datosActualizados } =
      req.body;

    if (Object.keys(datosActualizados).length > 0) {
      operacionesMongo.$set = datosActualizados;
    }
    if (agregarPrestamos) {
      const prestamosArray = Array.isArray(agregarPrestamos)
        ? agregarPrestamos
        : [agregarPrestamos];

      operacionesMongo.$addToSet = { prestamos: { $each: prestamosArray } };
    }

    if (eliminarPrestamos) {
      const prestamosArray = Array.isArray(eliminarPrestamos)
        ? eliminarPrestamos
        : [eliminarPrestamos];
      operacionesMongo.$pull = { prestamos: { $in: prestamosArray } };
    }

    if (Object.keys(operacionesMongo).length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: 'ValidationError',
          message: "No hay datos para actualizar",
        },
      });
    }

    const updatedLibro = await Libro.findByIdAndUpdate(id, operacionesMongo, {
      new: true,
      runValidators: true,
    })
      .populate({ path: 'administrador', select: 'nombre email rol' })
      .populate({
        path: 'prestamos',
        select: 'fechaInicio fechaFin estado',
        populate: { path: 'lector', select: 'nombre email' },
      });
    return res.status(201).json({
      success: true,
      statusCode: 200,
      data: updatedLibro,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message: "Error al actualizar libro" ,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

//!Delete solo admin

const deleteLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Libro.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: deleted,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message:"Error al eliminar libro",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

module.exports = {
  postLibro,
  getLibros,
  getLibroById,
  updateLibro,
  deleteLibro,
};
