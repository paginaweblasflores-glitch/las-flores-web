export function getFestividadesDestacadas<T extends { id: number }>(items: T[]): T[] {
  return items.slice(0, 3);
}
