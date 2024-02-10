import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { UuidAdapter } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(
    //* Inyección de dependencias con valor por defecto 
    private readonly uuid = UuidAdapter.v4
  ) {}

  //* Verificar si la carpeta existe pasando el path de esta misma
  private checkFolder(folderPath: string) {
    //* Si la carpeta no existe, se cre
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  public async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    try {
      //* Guardando la extensión del archivo a subir
      const fileExtension = file.mimetype.split("/").at(1) ?? '';
      //* Verificar si la extensión del archivo es válida
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid file extension: ${fileExtension}, valid ones ${validExtensions}`);
      }

      //* Path de carpeta destino en donde se guardará el archivo
      const destination = path.join(__dirname, "../../../", folder);
      //* Verificar si la carpeta existe, si no, se crea
      this.checkFolder(destination);

      //* Crear un nombre único para el archivo 
      const fileName = `${this.uuid()}.${fileExtension}`;

      //* Mover el archivo el archivo subido a la carpeta destino
      file.mv(`${destination}/${fileName}`);

      return { fileName };
      
    } catch (error) {
      // console.log({ error });
      throw error;
    }
  }

  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    //* Subrir cada archivo de manera individual y retornar un arreglo con los nombres de los archivos subidos 
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder, validExtensions))
    );

    return fileNames;
  }
}
