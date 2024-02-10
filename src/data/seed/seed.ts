import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";

//? En este archivo se crean los datos de prueba para la base de datos, es decir, se ejecuta el SEED 

(async () => {
  //* Conexion a la base de datos de mongoDB 
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });
  
  await main();

  //* Desconexion de la base de datos de mongoDB
  await MongoDatabase.disconnect();
})();


//* Funcion para generar un numero aleatorio entre 0 y X 
const randomBeetween0AndX = (x: number) => {
  return Math.floor(Math.random() * x);
}


async function main() {
  //* Borrar todos los datos de las colecciones de la base de datos 
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  //* Crear usuarios
  const users = await UserModel.insertMany(seedData.users);
  
  //* Crear categorias con su el  id del usuario
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[0]._id
    }))
  );
  
  //* Crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      //* Seleccionar un usuario aleatorio de la lista de usuarios 
      user: users[randomBeetween0AndX(seedData.users.length - 1)]._id,
      //* Seleccionar una categoria aleatoria de la lista de categorias 
      category: categories[randomBeetween0AndX(seedData.categories.length - 1)]._id,
    }))
  );

  console.log('SEEDED');
}