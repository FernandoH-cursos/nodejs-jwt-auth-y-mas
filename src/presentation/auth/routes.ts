import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config/envs';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    
    //* Servicio de email pasando las variables de entorno necesarias 
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );
    const authService = new AuthService(emailService);

    const authController = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', authController.loginUser);
    router.post('/register',authController.registerUser);
    
    router.get('/validate-email/:token',authController.validateEmail);



    return router;
  }


}

