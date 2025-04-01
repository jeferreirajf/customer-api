export type Pagination<T> = {
  items: T[];
  total: number;
  perPage: number;
  currentPage: number;
  prev: number | null;
  next: number | null;
  lastId: string;
};
