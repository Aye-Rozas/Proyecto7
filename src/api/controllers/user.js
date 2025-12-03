const { generateSign } = require('../../config/jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ email: req.body.email });
    if (userDuplicated) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: 'DuplicateError',
          message: "Email ya registrado",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const newUser = new User({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
      rol: req.body.rol || 'lector',
    });

    const userSaved = await newUser.save();

    return res.status(201).json({
      success: true,
      statusCode: 201,
      data: userSaved,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message: "Error interno al actualizar usuario",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: 'AuthError',
          message: 'El usuario o contraseña no existe',
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateSign(user._id);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: { user, token },
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: 'AuthError',
          message: 'El usuario o contraseña no existe',
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message:"Error en email o contraseña",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || 'ServerError',
        message:"Error al obtener usuario",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selfUpdate = req.user._id.toString() === id;
    const adminUser = req.user.rol === 'admin';

    if (!selfUpdate && !adminUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: 'NotFound',
          message: 'No tienes permiso para actualizar este usuario',
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }
    const updateData = {};
    if (req.body.nombre) updateData.nombre = req.body.nombre;
    if (req.body.email) {
      const emailExiste = await User.findOne({ email: req.body.email });
      if (emailExiste && emailExiste._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            type: 'NotFound',
            message: 'Email ya registrado',
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      }
      updateData.email = req.body.email;
    }
    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.rol) {
      if (selfUpdate) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            type: 'NotFound',
            message: "No tienes permiso habilitado para realizar el cambio",
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      } else if (adminUser) {
        updateData.rol = req.body.rol;
      }}

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            type: 'NotFoundError',
            message: "Usuario no encontrado",
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message:"Error al actualizar usuario",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const reqUser = req.user;

    if (reqUser._id.toString() === id) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            type: 'NotFound',
            message: 'Usuario no encontrado',
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid || user.email !== email) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            type: 'AuthError',
            message: "Email o contraseña incorrecta",
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      }

      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: `Tu cuenta (${user.email}) ha sido eliminada`,
      });
    }
    if (reqUser.rol === 'admin') {
      const userDeleted = await User.findByIdAndDelete(id);
      if (!userDeleted) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            type: 'NotFound',
            message: 'Usuario no encontrado',
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: `Usuario eliminado: ${userDeleted}`,
      });
    }
    return res.status(403).json({
      success: false,
      statusCode: 400,
      error: {
        type: 'Forbidden',
        message: 'No tienes permisos para eliminar este usuario',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || 'ServerError',
        message: "Error al eliminar usuario",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
};
