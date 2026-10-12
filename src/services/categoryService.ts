import { queryOptions } from "@tanstack/react-query";
import { DatabaseService } from "@/lib/database/databaseService";
import type { Category } from "@/types";
import { configService } from "./configService";

const service = new DatabaseService<Category>("categories", configService.getGroupId(), true);

export const getCategories = () => service.getAll("orderBy", true);
export const getCategoryById = (id: number) => service.getById(id);
export const createCategory = (c: Omit<Category, "id" | "createdAt" | "updatedAt">) => service.create(c);
export const updateCategory = (id: number, u: Partial<Omit<Category, "id">>) => service.update("id", id, u);
export const deleteCategory = (id: number) => service.delete("id", id);

export const categoriesQuery = queryOptions({ queryKey: ["categories"], queryFn: getCategories });
