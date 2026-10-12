import { queryOptions } from "@tanstack/react-query";
import { DatabaseService } from "@/lib/database/databaseService";
import type { Product } from "@/types";
import { configService } from "./configService";

const service = new DatabaseService<Product>("products", configService.getGroupId(), true);

export async function getProducts(): Promise<Product[]> {
  const all = await service.getAll("displayOrder", true);
  return all.filter((p) => p.isAvailable);
}
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categoryId === categoryId);
}
export const getProductById = (id: number) => service.getById(id);
export const createProduct = (p: Omit<Product, "id" | "createdAt" | "updatedAt">) => service.create(p);
export const updateProduct = (id: number, u: Partial<Omit<Product, "id">>) => service.update("id", id, u);
export const deleteProduct = (id: number) => service.delete("id", id);

export const productsQuery = queryOptions({ queryKey: ["products"], queryFn: getProducts });
