const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'lector'], default: 'lector' },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: 'user' },
);

userSchema.pre("save",function(){
  this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('user', userSchema, 'user');
module.exports = User;
