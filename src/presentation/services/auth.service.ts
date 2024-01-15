import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";
import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { EmailService } from "./email.service";

export class AuthService {
  // Dependencies Inyection
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    //* Verificamos si el email ya existe en la base de datos
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    //* Si existe el email, lanzamos un error
    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      //* Creamos el usuario a partir de sus modelo de mongoDB
      const user = new UserModel(registerUserDto);

      //* Encriptar el password usando bcrypt
      user.password = bcryptAdapter.hash(registerUserDto.password);

      //* Guardamos el usuario en la base de datos
      await user.save();

      //* Email de confirmacion que valida link
      await this.sendEmailValidationLink(user.email);

      //* Convertimos el usuario a una entidad UserEntity
      const { password, ...userEntity } = UserEntity.fromObject(user);

      //* JWT para mantener la autenticación del usuario
      const token = await JwtAdapter.generateToken({ id: user.id });
      //* Si no se pudo crear el token JWT, lanzamos un error
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      return {
        user: userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //* Verificamos si el email ya existe en la base de datos
    const user = await UserModel.findOne({ email: loginUserDto.email });
    //* Si no existe el email del usuario, lanzamos un error
    if (!user) throw CustomError.badRequest("Email not exist");

    //* Comparamos el password pasado con el password encriptado
    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password!
    );
    //* Si el password no es igual al password encriptado, lanzamos un error
    if (!isMatching) throw CustomError.badRequest("Password is not valid");

    //* Convertimos el usuario a una entidad UserEntity
    const { password, ...userEntity } = UserEntity.fromObject(user);

    //* JWT para mantener la autenticación del usuario
    const token = await JwtAdapter.generateToken({ id: user.id });
    //* Si no se pudo crear el token JWT, lanzamos un error
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      user: userEntity,
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => { 
    //* Generamos un token para el usuario mandando el email como payload
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    //* Generamos link de confirmacion de email
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const htmlBody = /*html*/`
      <h1>Verify your email</h1>
      <p>Click the following link to verify your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Verify your email",
      htmlBody,
    };

    //* Enviamos el email de confirmacion
    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  }

  public async validateEmail(token: string) {
    //* Verificamos si el token es valido
    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");
    
    const { email } = payload as { email: string };
    if(!email) throw CustomError.internalServer("Email not in token")

    //* Verificamos si el usuario existe en la base de datos
    const user = await UserModel.findOne({ email, });
    if (!user) throw CustomError.badRequest("User not exist");

    //* Actualizamos el usuario validando su email ya que el token es valido
    user.emailValidated = true;
    
    await user.save();

    return true;
  }
}