import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const fileUploadService = new FileUploadService();
    const fileUploadController = new FileUploadController(fileUploadService);

    //? Aplicando middlewares a las rutas POST tanto para archivos individuales como multiples

    //* Middleware para verificar si el archivo a subir existe 
    router.use(FileUploadMiddleware.containFiles);
    //* Middleware para verificar si el tipo de archivo a subir es válido 
    router.use(TypeMiddleware.validType(["users", "products", "categories"]));

    // Definir rutas
    router.post("/single/:type", fileUploadController.uploadFile);
    router.post("/multiple/:type",fileUploadController.uploadMultipleFiles);

    return router;
  }


}

