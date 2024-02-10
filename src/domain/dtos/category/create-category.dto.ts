export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean
  ) {}

  //? Dto para crear una categoria
  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, available = false } = object;
    let avalaibleBoolean = available;

    if (!name) return ["Missing name"];
    if (typeof available !== "boolean") {
      avalaibleBoolean = available === "true";
    }

    return [undefined, new CreateCategoryDto(name, avalaibleBoolean)];
  }
}