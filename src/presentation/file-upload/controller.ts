import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { UploadedFile } from "express-fileupload";
import { FileUploadService } from "../services/file-upload.service";

export class FileUploadController {
  // Dependencies Inyection
  constructor(private readonly fileUploadService: FileUploadService) {}

  //* Metodo para manejar los errores personalizados
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }

  uploadFile = (req: Request, res: Response) => {
    //* Obteniendo el tipo de archivo a subir
    const type = req.params.type;
  
    //* Obteniendo el archivo a subir del middleware 'FileUploadMiddleware' que lo establecio en
    //* en una propiedad del body de la petición llamada 'files'
    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService
      .uploadSingle(file,`uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  uploadMultipleFiles = (req: Request, res: Response) => {
    //* Obteniendo el tipo de archivo a subir
    const type = req.params.type;
   

    //* Obteniendo el archivo a subir del middleware 'FileUploadMiddleware' que lo establecio en
    //* en una propiedad del body de la petición llamada 'files'
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
