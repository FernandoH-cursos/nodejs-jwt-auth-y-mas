import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
  hash: (password: string) => {
    //* Generamos un salt para encriptar el password 
    const salt = genSaltSync();

    //* Encriptamos el password pasado con el salt generado y lo retornamos 
    return hashSync(password, salt);
  },
  compare: (password: string, hashed: string) => {
    //* Comparamos el password pasado con el password encriptado 
    return compareSync(password, hashed);
  }
}