//* Clase para manejar los errores personalizados 
export class CustomError extends Error {

  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
  }

  //* Método para crear un error de tipo 400 que indica que la petición no es válida
  static badRequest(message: string) { 
    return new CustomError(400, message);
  }

  //* Método para crear un error de tipo 401 que indica que la petición no está autorizada 
  static unauthorized(message: string) {
    return new CustomError(401, message);
  }

  //* Método para crear un error de tipo 404 que indica que la petición no se encontró
  static notFound(message: string) {
    return new CustomError(404, message);
  }

  //* Método para crear un error de tipo 500 que indica que hubo un error en el servidor
  static internalServer(message: string) {
    console.log(message);
    return new CustomError(500, message);
  }
}