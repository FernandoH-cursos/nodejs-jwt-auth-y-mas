import { Router } from "express";
import { ImageController } from "./controller";


export class ImagesRoutes {
 
  static get routes(): Router{
    const router = Router();
    const imageController = new ImageController();

    router.get('/:type/:img',imageController.getImages);

    return router;
  }
}