import { NextRequest, NextResponse } from "next/server";
import { products } from "@/app/utils/data";
import { UpdateProductDTO } from "@/app/utils/DTOs";

interface Props {
  params: { id: string };
};

const getProductById = (id: string) => {
  return products.find(p => p.id === parseInt(id));
};

/**
 * @method GET
 * @route  ~/api/products/:id
 * @dec    Get Single Product By Id
 * @access public
 */
export function GET(request: NextRequest, {params}: Props) {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json({message: "Product not found"}, {status: 404});
  };

  return NextResponse.json(product, {status: 200});
};

/**
 * @method PUT
 * @route  ~/api/products/:id
 * @dec    Update A Product
 * @access public
 */
export async function PUT(request: NextRequest, {params}: Props) {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json({message: "Product not found"}, {status: 404});
  };

  const body = (await request.json()) as UpdateProductDTO;

  console.log(body);

  return NextResponse.json({message: "Product updated"}, {status: 200});
};

/**
 * @method DELETE
 * @route  ~/api/products/:id
 * @dec    Delete A Product
 * @access public
 */
export async function DELETE(request: NextRequest, {params}: Props) {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json({message: "Product not found"}, {status: 404});
  };

  return NextResponse.json({message: "Product deleted"}, {status: 200});
};
