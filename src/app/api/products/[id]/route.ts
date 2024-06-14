import { NextRequest, NextResponse } from "next/server";
import { UpdateProductDTO } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: { id: string };
}

/**
 * @method GET
 * @route  ~/api/products/:id
 * @dec    Get Single Product By Id
 * @access public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route  ~/api/products/:id
 * @dec    Update A Product
 * @access private (Only admins can update any product)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // Check if the logged in user is an admin by its payload on his token
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Only admin can update product" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

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
}

/**
 * @method DELETE
 * @route  ~/api/products/:id
 * @dec    Delete A Product
 * @access private (Only admins can delete any product and its related comments)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Check if the logged in user is an admin by its payload on his token
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Only admin can update product" },
        { status: 403 }
      );
    }

    // Fetch the targetted product and its related comments from database
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        comments: true,
      },
    });

    // Check if the product is existed in database
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Deleting the product from database (prisma)
    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    });

    // Deleting all the product's related comments from database
    const commentIds: number[] = product?.comments.map(comment => comment.id);
    await prisma.comment.deleteMany({
      where: { id: { in: commentIds } },
    });

    return NextResponse.json(
      { message: "The product and its comments are deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
