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
          type: "DuplicateError",
          message: "Email ya registrado",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
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
      data: userSaved
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
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
          type: "AuthError",
          message: "El usuario o contraseña no existe",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateSign(user._id);
      return res.status(200).json({
      success: true,
      statusCode: 200,
      data: { user, token }
    });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: "AuthError",
          message: "El usuario o contraseña no existe",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: users
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { rol },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: "NotFound",
          message: "Usuario no encontrado",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: updatedUser
  });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const deleteSelf = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: {
          type: "NotFound",
          message: "Usuario no encontrado",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    }

    const isPasswordVAlid = bcrypt.compareSync(password, user.password);
    if (!isPasswordVAlid) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          type: "AuthError",
          message: "Contraseña incorrecta",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    }

    await User.findByIdAndDelete(user._id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: `Tu cuenta (${user.email}) ha sido eliminada`
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: `Usuario eliminado: ${userDeleted}`
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: {
        type: error.name || "ServerError",
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  deleteSelf,
  deleteUser,
};
