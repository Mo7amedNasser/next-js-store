import { NextRequest, NextResponse } from 'next/server';
import { createProductSchema } from '@/utils/validationSchemas';
import { CreateProductDTO } from '@/utils/DTOs';
import prisma from '@/utils/db';
import { Product } from '@prisma/client';

/**
 * @method GET
 * @route  ~/api/products
 * @dec    Get All Products
 * @access public
 */
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * @method POST
 * @route  ~/api/products
 * @dec    Created New Product
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProductDTO;

    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    };

    const newProduct: Product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        brand: body.brand,
        image: body.image,
        price: body.price,
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
