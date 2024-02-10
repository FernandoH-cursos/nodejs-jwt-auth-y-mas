export class PaginationDto{
  private constructor(
    public readonly page: number,
    public readonly limit: number,
  ) { }

  static create(page: number = 1, limit: number = 10): [string?, PaginationDto?] {
    //* Validando que el 'page' y el 'limit' sean numeros 
    if (isNaN(page) || isNaN(limit)) return ["Page and limit must be numbers"];
    //* Validando que el 'page' sea mayor a 0 para evitar errores de paginacion 'page=0&limit=0'
    if (page <= 0) return ["Page must be greater than 0"]; 
    //* Validando que el 'limit' sea mayor a 0 para evitar errores de paginacion 'page=1&limit=0'
    if (limit <= 0) return ["Limit must be greater than 0"];
      

    return [undefined, new PaginationDto(page, limit)];
  }
}