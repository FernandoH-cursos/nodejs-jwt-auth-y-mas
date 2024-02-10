import { Request, Response, NextFunction } from "express";

export class FileUploadMiddleware {
  static containFiles(req: Request, res: Response, next: NextFunction) {
    //* Verificando que se haya seleccionado un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were selected." });
    }

    //* Si el archivo seleccionado no es un array, se convierte en un array  sino se mantiene como está
    if (!Array.isArray(req.files.file)) {
      //* Convertir el archivo en un array y guardando en el body de la petición 
      req.body.files = [req.files.file];
    } else {
      req.body.files = req.files.file;
    }

    next();
  }
}
