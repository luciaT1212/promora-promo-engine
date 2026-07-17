export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly parentId: string | null = null,
  ) {}
}
