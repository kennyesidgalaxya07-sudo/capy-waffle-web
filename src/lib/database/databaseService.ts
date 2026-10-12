import { supabase } from "./supabaseClient";
import type { BaseEntity } from "@/types";

/**
 * Servicio genérico CRUD sobre una tabla de Supabase.
 * Solo devuelve filas activas (`state = true`) y filtra por `groupId` cuando aplica.
 */
export class DatabaseService<T extends BaseEntity> {
  constructor(
    private tableName: string,
    private groupId: number = 1,
    private hasGroupId: boolean = false,
  ) {}

  async getAll(orderBy: keyof T & string = "id" as keyof T & string, ascending = true): Promise<T[]> {
    try {
      let query = supabase.from(this.tableName).select("*").eq("state", true);
      if (this.hasGroupId) query = query.eq("groupId", this.groupId);
      const { data, error } = await query.order(orderBy, { ascending });
      if (error) throw error;
      return (data ?? []) as T[];
    } catch (e) {
      console.error(`[DatabaseService] getAll ${this.tableName}:`, e);
      throw e;
    }
  }

  async getByField(column: keyof T & string, value: unknown): Promise<T | null> {
    try {
      let query = supabase.from(this.tableName).select("*").eq(column as string, value as never);
      if (this.hasGroupId) query = query.eq("groupId", this.groupId);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return (data as T) ?? null;
    } catch (e) {
      console.error(`[DatabaseService] getByField ${this.tableName}:`, e);
      throw e;
    }
  }

  getById(id: number): Promise<T | null> {
    return this.getByField("id" as keyof T & string, id);
  }

  async create(item: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    try {
      const row = this.hasGroupId ? { ...item, groupId: this.groupId } : item;
      const { data, error } = await supabase.from(this.tableName).insert([row] as never).select().single();
      if (error) throw error;
      return data as T;
    } catch (e) {
      console.error(`[DatabaseService] create ${this.tableName}:`, e);
      throw e;
    }
  }

  async update(column: keyof T & string, value: unknown, updates: Partial<Omit<T, "id">>): Promise<T | null> {
    try {
      let query = supabase.from(this.tableName).update(updates as never).eq(column as string, value as never);
      if (this.hasGroupId) query = query.eq("groupId", this.groupId);
      const { data, error } = await query.select().maybeSingle();
      if (error) throw error;
      return (data as T) ?? null;
    } catch (e) {
      console.error(`[DatabaseService] update ${this.tableName}:`, e);
      throw e;
    }
  }

  async delete(column: keyof T & string, value: unknown): Promise<boolean> {
    try {
      let query = supabase.from(this.tableName).delete().eq(column as string, value as never);
      if (this.hasGroupId) query = query.eq("groupId", this.groupId);
      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (e) {
      console.error(`[DatabaseService] delete ${this.tableName}:`, e);
      return false;
    }
  }

  async searchByField(column: keyof T & string, term: string): Promise<T[]> {
    try {
      let query = supabase.from(this.tableName).select("*").eq("state", true).ilike(column, `%${term}%`);
      if (this.hasGroupId) query = query.eq("groupId", this.groupId);
      const { data, error } = await query.order("id");
      if (error) throw error;
      return (data ?? []) as T[];
    } catch (e) {
      console.error(`[DatabaseService] searchByField ${this.tableName}:`, e);
      throw e;
    }
  }
}
