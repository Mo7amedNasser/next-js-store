import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/app/utils/data';
import { Product } from '@/app/utils/types';
import { createProductSchema } from '@/app/utils/validationSchemas';
import { CreateProductDTO } from '@/app/utils/DTOs';

/**
 * @method GET
 * @route  ~/api/products
 * @dec    Get All Products
 * @access public
 */
export function GET(request: NextRequest) {
  return NextResponse.json(products, {status: 200});
};

/**
 * @method POST
 * @route  ~/api/products
 * @dec    Created New Product
 * @access public
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateProductDTO;

  const validation = createProductSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({message: validation.error.errors[0].message}, {status: 400});
  };

  const newProduct: Product = {
    id: products.length + 1,
    title: body.title,
    category: "Mobile",
    brand: "Xiaomi",
    image: "https://via.placeholder.com/150",
    description: body.body,
    price: 999,
  };

  products.push(newProduct);
  return NextResponse.json(newProduct, {status: 201});
};
