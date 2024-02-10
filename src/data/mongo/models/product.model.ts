import mongoose, { Schema } from "mongoose";

//* Definimos el esquema de la colección de productos
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  user: {
    //* Esto lo que hace es decirle a mongoose que el campo user es una referencia a un objeto de tipo User
    type: Schema.Types.ObjectId,
    //* Esto le dice a mongoose que la referencia es al modelo User
    ref: "User",
    required: [true, "User is required"],
  },
  category: {
    //* Esto lo que hace es decirle a mongoose que el campo category es una referencia a un objeto de tipo Category
    type: Schema.Types.ObjectId,
    //* Esto le dice a mongoose que la referencia es al modelo Category
    ref: "Category",
    required: [true, "Category is required"],
  },
});

// set() es un metodo de mongoose que nos permite modificar el comportamiento de los objetos de tipo Schema 
productSchema.set("toJSON", {
  // Permite que cuando se convierta el objeto a JSON se incluyan los virtuals como el 'id' 
  virtuals: true,
  // Permite que cuando se convierta el objeto a JSON se incluya el 'id' y no '_id'
  versionKey: false,
  // Permite que cuando se convierta el objeto a JSON se elimine el '_id'
  transform: function (_, ret) {
    delete ret._id;
  },
});

//* Definimos el modelo de la colección de productos
export const ProductModel = mongoose.model("Product", productSchema);
