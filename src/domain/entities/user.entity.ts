import { CustomError } from "../errors/custom.error";

export class UserEntity{
  constructor(
    public id: string,
    public name: string,
    public email: string,
    //* Propiedad para indicar si el email fue validado 
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string,
  ) { }
  
  //? Método para crear una instancia de la entidad 'UserEntity' a partir de un objeto 
  static fromObject(object: { [key: string]: any }): UserEntity { 
    const { id, _id, name, email, emailValidated, password, role, img } = object;
    
    //* Si no se recibe el id ni el _id, se lanza un error 
    if (!_id && !id) throw CustomError.badRequest('Missing id');

    //* Validando todas las propiedades del objeto 
    if (!name) throw CustomError.badRequest('Missing name');
    if (!email) throw CustomError.badRequest('Missing email');
    if(emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!role) throw CustomError.badRequest('Missing role');
  
    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}