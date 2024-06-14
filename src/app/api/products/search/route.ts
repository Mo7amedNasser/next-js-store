import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

/**
 * @method GET
 * @route  ~/api/products/search?searchQuery=value
 * @dec    Get Product By The Search Query
 * @access public
 */
export async function GET(request: NextRequest) {
  try {
    // Get the searchQuery from the url
    const searchQuery = request.nextUrl.searchParams.get('searchQuery');

    // Declare a variable to store the filtered products into it
    let products;

    if (searchQuery) {
      products = await prisma.product.findMany({
        where: {
          title: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      });
    } else {
      // Get the default pagination logic for products
      products = await prisma.product.findMany({
        take: 6,
      });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};
