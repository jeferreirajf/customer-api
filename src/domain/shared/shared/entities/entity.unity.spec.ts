import { Utils } from '@/shared/utils/utils';
import { Entity } from './entity';

describe('Entity', () => {
  class TestEntity extends Entity {
    constructor(id: string, createdAt: Date, updatedAt: Date) {
      super(id, createdAt, updatedAt);
    }

    protected validate(): void {}

    public hasChanged(): void {
      super.hasChanged();
    }
  }

  it('should create an entity with valid parameters', () => {
    const id = '1';
    const createdAt = new Date();
    const updatedAt = new Date();

    const entity = new TestEntity(id, createdAt, updatedAt);

    expect(entity.getId()).toBe(id);
    expect(entity.getCreatedAt()).toBe(createdAt);
    expect(entity.getUpdatedAt()).toBe(updatedAt);
  });

  it('should compare two entities correctly', () => {
    const id = '1';
    const createdAt = new Date();
    const updatedAt = new Date();

    const laterCreatdAt = new Date(createdAt.getTime() + 1000);
    const laterUpdatedAt = new Date(updatedAt.getTime() + 1000);

    const entity1 = new TestEntity(id, createdAt, updatedAt);
    const entity2 = new TestEntity(id, laterCreatdAt, laterUpdatedAt);
    const entity3 = new TestEntity('2', createdAt, updatedAt);

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
    expect(entity1.equals(null)).toBe(false);
    expect(entity1.equals(undefined)).toBe(false);
    expect(entity1.equals(entity1)).toBe(true);
  });

  it('should update the updatedAt timestamp when hasChanged is called', async () => {
    const id = '1';
    const createdAt = new Date();
    const updatedAt = new Date();

    const entity = new TestEntity(id, createdAt, updatedAt);
    const initialUpdatedAt = entity.getUpdatedAt();

    await Utils.Sleep(50);

    entity.hasChanged();

    const newUpdatedAt = entity.getUpdatedAt();

    expect(newUpdatedAt).not.toEqual(initialUpdatedAt);
    expect(newUpdatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
  });
});
