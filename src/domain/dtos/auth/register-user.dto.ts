import { regularExps } from '../../../config/regular-exp';

export class RegisterUserDto {
  //* Un constructor privado para que no se pueda instanciar la clase en otro lugar 
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) { }
  
  //? Dto para registrar un usuario
  static create(object: {[key: string]: any}): [string?,RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['Missing name'];
    if (!email) return ['Missing email'];
    //* Validamos que el email tenga el formato correcto con una expresión regular 
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if(password.length < 6) return ['Password too short'];

    return [undefined, new RegisterUserDto(name, email, password)];

  }
}