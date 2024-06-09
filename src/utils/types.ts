export type Product = {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  description: string;
  price: number;
};

export type JWTPayload = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
};
