import mongoose from "mongoose";

interface Options{
  mongoUrl: string;
  dbName: string;
}

//* Clase que se encarga de la conexión a la base de datos de mongoDB 
export class MongoDatabase { 
  static async connect(options: Options) {
    const { mongoUrl, dbName } = options;
    
    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
      
      return true;
    } catch (error) {
      console.log('Mongo connection error');
      throw error;
    }
  }
}