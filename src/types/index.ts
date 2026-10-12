/** Fila base de toda tabla: id numérico. */
export interface BaseEntity {
  id: number;
}

/** Tabla `categories` */
export interface Category extends BaseEntity {
  name: string;
  description: string | null;
  state: boolean;
  groupId: number;
  orderBy: number;
  createdAt: string;
  updatedAt: string;
}

/** Tabla `product_ingredient_details` */
export interface ProductIngredientDetail extends BaseEntity {
  productId: number;
  name: string;
  description: string | null;
  state: boolean;
  groupId: number;
}

/** Tabla `product_detail_products` */
export interface ProductDetailProduct extends BaseEntity {
  productId: number;
  state: boolean;
  groupId: number;
  [key: string]: unknown;
}

/** Tabla `products` */
export interface Product extends BaseEntity {
  categoryId: number;
  name: string;
  description: string | null;
  legend: string | null;
  price: number;
  isPromotion: boolean;
  imageUrl: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  state: boolean;
  groupId: number;
  code: string | null;
  displayOrder: number;
  piecesOfChicken: number | null;
  createdAt: string;
  updatedAt: string;
  productIngredientDetail?: ProductIngredientDetail[];
  productDetailProduct?: ProductDetailProduct[];
}
