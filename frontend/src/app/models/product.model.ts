export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
}

/**
 * Product interface as returned by the .NET API.
 */
export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  image: string;
}

/**
 * Converts a Product from the .NET API format to the Angular app format.
 */
export function normalizeProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.category.id,
    categoryName: product.category.name,
    image: product.image,
  };
}
