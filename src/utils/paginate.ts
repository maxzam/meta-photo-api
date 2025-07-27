import { PaginationParams } from "../types/controllers/PaginationParams";

export function paginate<T>(
  data: T[],
  { offset, limit }: PaginationParams
): T[] {
  return data.slice(offset, offset + limit);
}
