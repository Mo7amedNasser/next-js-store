import { NextRequest, NextResponse } from "next/server";
import { UpdateProductDTO } from "@/app/utils/DTOs";
import prisma from "@/app/utils/db";

interface Props {
  params: { id: string };
};

/**
 * @method GET
 * @route  ~/api/products/:id
 * @dec    Get Single Product By Id
 * @access public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

/**
 * @method PUT
 * @route  ~/api/products/:id
 * @dec    Update A Product
 * @access public
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    };

    const body = (await request.json()) as UpdateProductDTO;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        brand: body.brand,
        image: body.image,
        price: body.price,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * @method DELETE
 * @route  ~/api/products/:id
 * @dec    Delete A Product
 * @access public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    };

    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
