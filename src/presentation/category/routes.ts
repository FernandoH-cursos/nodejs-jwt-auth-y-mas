import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const categoryController = new CategoryController(categoryService);

    // Definir rutas
    router.get("/", categoryController.getCategories);
    //* Validando que el usuario este autenticado para poder crear una categoria.
    //* El 2do argumento es el middleware que se ejecutara antes de ejecutar el controlador.
    router.post(
      "/",
      [AuthMiddleware.validateJWT],
      categoryController.createCategory
    );

    return router;
  }
}
