import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  // Dependencies Inyection
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  //* Metodo para manejar los errores personalizados
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }

  createCategory = (req: Request, res: Response) => { 
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });
    
    //* Llamamos al servicio para crear la categoria
    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));

  }

  getCategories = (req: Request, res: Response) => {
    //* Obtenemos el 'page' y el 'limit' de la query 
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    //* Llamamos al servicio para obtener las categorias
    this.categoryService.getCategories(paginationDto!)
      .then(categories => res.json(categories))
      .catch((error) => this.handleError(error, res));
  }
}