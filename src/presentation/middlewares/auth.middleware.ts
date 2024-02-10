import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    //* Guardando el token de autorizacion del header de la peticion
    const authorization = req.header("Authorization");
    //* Validando que el token exista
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    //* Validando que el token sea valido verificando que empiece con "Bearer "
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer token" });
    //* Guardando el token sin el "Bearer "
    const token = authorization.split(" ").at(1) || "";

    try {
      //* Validando que el token sea valido y que no haya expirado, ademas de devolver el payload del usuario
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      //* Validando que el usuario exista usando el payload del usuario
      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: "Invalid token - user" });

      // TODO: Validar que el usuario no este activo

      //* Guardando el usuario en la peticion body para usarlo en los controladores y asi no tener que buscarlo de nuevo.
      req.body.user = UserEntity.fromObject(user);

      //* 'next()' es para que continue con el siguiente controlador del enrutador y asi no se quede en este middleware.
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
