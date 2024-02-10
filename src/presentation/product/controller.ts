import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";
import { ProductService } from "../services/product.service";

export class ProductController {
  // Dependencies Inyection
  constructor(
    private readonly productService: ProductService,
  ) {}

  //* Metodo para manejar los errores personalizados
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }

  createProduct = (req: Request, res: Response) => { 
    //* Le pasamos los datos recibidos al Dto para crear un producto y el usuario del token del Middleware que se ejecuto antes 
    const [error, createProductDto] = CreateProductDto.create({ ...req.body , user: req.body.user.id});
    if (error) return res.status(400).json({ error });
    
    // //* Llamamos al servicio para crear el producto
    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.status(201).json(product))
      .catch((error) => this.handleError(error, res));
  }

  getProducts = (req: Request, res: Response) => {
    //* Obtenemos el 'page' y el 'limit' de la query 
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });
    
    //* Llamamos al servicio para obtener las categorias
    this.productService.getProducts(paginationDto!)
      .then(products => res.json(products))
      .catch((error) => this.handleError(error, res));

  }
}