export abstract class Entity {
  protected constructor(
    private readonly id: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  protected abstract validate(): void;

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  protected hasChanged(): void {
    this.updatedAt = new Date();
  }

  public equals(entity: Entity): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this.id === entity.id;
  }
}
