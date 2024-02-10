import { Request, Response, NextFunction } from "express";

export class TypeMiddleware {
  static validType(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      //* Al req.params.type en un middleware que se llama globalmente nos dará como valor un undefined, porque
      //* el middleware se ejecuta antes de que se ejecute el controlador que tiene la ruta que se está llamando 
      // const type = req.params.type;
      
      //* Es mejor usar req.url para obtener el tipo de archivo que se está subiendo ya que nos devuelve el path del
      //* endpoint que se está llamando, y de esta manera no necesitamos que el cliente envíe el tipo de archivo  
      const type = req.url.split("/").at(-1) ?? '';

      //* Verificar si el tipo de archivo es válido
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({ message: `Invalid type: ${type}, valid ones ${validTypes}` });
      }

      next();
    }
  }
}
