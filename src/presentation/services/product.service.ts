import { ProductModel } from "../../data";
import {
  CustomError,
  PaginationDto,
} from "../../domain";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";

export class ProductService {
  constructor() {}

  public async createProduct(createProductDto: CreateProductDto) {
    //* Validando que el producto no exista para evitar duplicados
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    });
    if (productExists) throw CustomError.badRequest("Product already exists");

    try {
      //* Creando el product con los datos recibidos
      const product = new ProductModel(createProductDto);

      //* Guardando el producto en la base de datos con el usuario y su categoria
      await product.save();

      return product
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    //* Calculando el numero de pagina que se va a saltar, es decir, en que pagina se van a empezar a mostrar los datos
    const pageNumber = (page - 1) * limit;

    try {
      const [total, products] = await Promise.all([
        //* Obteniendo el total de categorias que hay en la base de datos
        ProductModel.countDocuments(),
        //* Obteniendo los productos de la base de datos con el limite y el numero de pagina que se va a saltar
        ProductModel.find()
          .skip(pageNumber)
          .limit(limit)
          .populate("user", ["name", "email", "emailValidated", "role"])
          .populate("category"),
        
      ]);

      return {
        page,
        limit,
        total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/products?page=${page - 1}&limit=${limit}`
            : null,
        products,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
