import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const productController = new ProductController(productService);

    // Definir rutas
    router.get("/", productController.getProducts);
    //* Validando que el usuario este autenticado para poder crear un producto.
    //* El 2do argumento es el middleware que se ejecutara antes de ejecutar el controlador.
    router.post(
      "/",
      [AuthMiddleware.validateJWT],
      productController.createProduct
    );

    return router;
  }
}
