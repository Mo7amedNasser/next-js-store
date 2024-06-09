/**
 * In the LoginUserDTO:
 *  > The username isn't important in the login process
 */

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

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
};

export interface LoginUserDTO {
  email: string;
  password: string;
};
