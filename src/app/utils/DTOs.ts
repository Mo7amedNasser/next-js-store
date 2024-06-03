export interface CreateProductDTO {
  title: string;
  description: string;
  category: string;
  brand: string;
  image: string;
  price: number;
};

export interface UpdateProductDTO {
  title?: string;
  description?: string;
  category?: string;
  brand?: string;
  image?: string;
  price?: number;
};
