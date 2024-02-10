import mongoose, { Schema } from "mongoose";

//* Definimos el esquema de la colección de categorias
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  user: {
    //* Esto lo que hace es decirle a mongoose que el campo user es una referencia a un objeto de tipo User
    type: Schema.Types.ObjectId,
    //* Esto le dice a mongoose que la referencia es al modelo User
    ref: "User",
    required: [true, "User is required"],
  },
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
  },
});

//* Definimos el modelo de la colección de categorias
export const CategoryModel = mongoose.model("Category", categorySchema);
