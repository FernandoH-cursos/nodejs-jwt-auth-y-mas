import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter{
  
  //? Metodo para generar un token JWT 
  static async generateToken(payload: any, duration: string = '2h') {
    return new Promise((resolve) => {
      //* Generamos el token JWT pasando el payload que sería el usuario, el secret key(SEED) que es string que solo
      //* nosotros conocemos y el tiempo de expiración del token que sirve para mantener la autenticación del
      //* usuario en un tiempo determinado.
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      });
    });
  }
  
  //? Metodo para verificar un token JWT 
  static validateToken<T>(token: string): Promise<T|null> {
    return new Promise((resolve) => {
      //* Verificamos que el token sea valido y que no haya expirado.
      //* Si el token es valido nos devuelve el payload del usuario.
      //* El 'JWT_SEED' es el secret key que solo nosotros conocemos.
      //* El 'decoded' es el payload del usuario. 
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded as T);
      });
    });
  }

}