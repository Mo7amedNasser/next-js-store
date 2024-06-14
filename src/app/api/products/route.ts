import { NextRequest, NextResponse } from 'next/server';
import { createProductSchema } from '@/utils/validationSchemas';
import { CreateProductDTO } from '@/utils/dtos';
import prisma from '@/utils/db';
import { Product } from '@prisma/client';
import { PRODUCT_PER_PAGE } from '@/utils/constants';
import { verifyToken } from '@/utils/verifyToken';

/**
 * @method GET
 * @route  ~/api/products
 * @dec    Get Products By Page Number
 * @access public
 */
export async function GET(request: NextRequest) {
  try {
    // Get the pageNumber query from API request
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1"; // 2

    const products = await prisma.product.findMany({
      skip: PRODUCT_PER_PAGE * (parseInt(pageNumber) - 1), // 6 * (2 - 1) = 6 * 1 = 6
      take: PRODUCT_PER_PAGE,
    });

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
 * @access private (Only admins can create new product)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the logged in user is an admin
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Only admin can create a product, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateProductDTO;

    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

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
