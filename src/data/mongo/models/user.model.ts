import mongoose from "mongoose";

//* Definimos el esquema de la colección de usuarios 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Name is required'],
  },
  email: {
    type: String,
    required: [true,'Email is required'],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    require: [true,'Password is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    enum: ['ADMIN_ROLE','USER_ROLE'],
    default: 'USER_ROLE',
  },
});

//* Definimos el modelo de la colección de usuarios 
export const UserModel = mongoose.model('User', userSchema);