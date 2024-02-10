import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class CategoryService{
  constructor() { }
  
  public async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    //* Validando que la categoria no exista para evitar duplicados
    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
    if (categoryExists) throw CustomError.badRequest("Category already exists");

    try {
      //* Creando la categoria con el id del usuario que la creo para poder hacer la relacion
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      //* Guardando la categoria en la base de datos con el usuario que la creo 
      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    //* Calculando el numero de pagina que se va a saltar, es decir, en que pagina se van a empezar a mostrar los datos 
    const pageNumber = (page - 1) * limit;

    try{
      
      const [total, categories] = await Promise.all([
        //* Obteniendo el total de categorias que hay en la base de datos 
        CategoryModel.countDocuments(),
        //* Obteniendo las categorias de la base de datos con el limite y el numero de pagina que se va a saltar
        CategoryModel.find().skip(pageNumber).limit(limit),
      ]);

      return {
        page,
        limit,
        total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
        categories: categories.map(({ id, name, available }) => ({
          id,
          name,
          available,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}